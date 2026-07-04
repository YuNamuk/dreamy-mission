'use server';

import { revalidatePath } from 'next/cache';
import { getAdmin, DEFAULT_SUPER, type AdminRole } from '@/lib/admin';
import { supabase } from '@/lib/supabase';
import { applyCountryEdit, loadCountryEdit, CONTENT_TABLE, type Visit } from '@/lib/content';
import { findCountry } from '@/lib/countries';
import { PHOTO_BASE } from '@/lib/uploaded-photos';
import { supabase as sb } from '@/lib/supabase';
import { HOME_KEY, loadHomeEdit, type HomeContent } from '@/lib/home';
import { SETTINGS_KEY, loadSettingsEdit, type SiteSettings } from '@/lib/settings';
import { loadPageEdit, type PageKey, type PageContent, PAGE_KEYS } from '@/lib/pages';
import { STORIES_KEY, type Story } from '@/lib/stories';

export interface Result {
  ok: boolean;
  error?: string;
}

async function requireAdmin(min: AdminRole) {
  const a = await getAdmin();
  if (!a) throw new Error('관리자 권한이 필요합니다.');
  if (min === 'super' && a.role !== 'super') throw new Error('전체 관리자만 가능합니다.');
  return a;
}

/** ── 관리자 관리 (전체 관리자 전용) ── */
export async function addAdmin(email: string, role: AdminRole, name: string): Promise<Result> {
  try {
    const me = await requireAdmin('super');
    const e = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { ok: false, error: '이메일 형식이 올바르지 않습니다.' };
    if (!supabase) return { ok: false, error: '백엔드 미연결' };
    const { error } = await supabase.from('admins').upsert(
      { email: e, role: role === 'super' ? 'super' : 'content', name: name.trim() || null, added_by: me.email },
      { onConflict: 'email' },
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function removeAdmin(email: string): Promise<Result> {
  try {
    const me = await requireAdmin('super');
    const e = email.trim().toLowerCase();
    if (e === DEFAULT_SUPER) return { ok: false, error: '기본 관리자는 삭제할 수 없습니다.' };
    if (e === me.email) return { ok: false, error: '본인 계정은 삭제할 수 없습니다.' };
    if (!supabase) return { ok: false, error: '백엔드 미연결' };
    const { error } = await supabase.from('admins').delete().eq('email', e);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** ── 콘텐츠 편집 (콘텐츠 관리자 이상) ── */
export async function saveCountryContent(
  id: string,
  patch: {
    intro?: string;
    themes?: { t?: string; d?: string }[];
    stats?: { capital?: string; pop?: string; area?: string; religion?: string; language?: string; government?: string; currency?: string; climate?: string; timezone?: string };
    timeline?: { y: string; items: string[] }[];
  },
): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    if (!findCountry(id)) return { ok: false, error: '알 수 없는 국가' };
    const res = await applyCountryEdit(id, patch, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** 전시 카테고리 구조(추가·삭제·순서) 저장 — themes/커버/갤러리를 새 순서로 원자적 재작성 */
export async function saveCountryStructure(
  id: string,
  data: { themes: { t: string; d: string }[]; covers: (string | null)[]; galleries: string[][] },
): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    if (!findCountry(id)) return { ok: false, error: '알 수 없는 국가' };
    if (!sb) return { ok: false, error: '백엔드 미연결' };
    if (!data.themes.length) return { ok: false, error: '카테고리는 최소 1개가 필요합니다.' };
    const existing = await loadCountryEdit(id);
    // 커버·갤러리를 새 인덱스에 맞춰 전체 재작성
    const images: Record<string, string> = {};
    data.covers.forEach((url, i) => { if (url) images[`th-${id}-${i + 1}`] = url; });
    const catPhotos: Record<string, string[]> = {};
    data.galleries.forEach((arr, i) => { if (arr && arr.length) catPhotos[String(i)] = arr; });
    const merged = {
      ...existing,
      themes: data.themes.map((t) => ({ t: t.t, d: t.d })),
      images,
      catPhotos,
    };
    const { error } = await sb.from(CONTENT_TABLE).upsert(
      { id, data: merged, updated_by: me.email, updated_at: new Date().toISOString() },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/${id}`);
    revalidatePath('/admin/' + id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** 카테고리 커버 사진 교체 → Supabase Storage 업로드 + 편집본에 URL 기록 */
export async function uploadCover(id: string, themeIndex: number, dataUrl: string): Promise<Result & { url?: string }> {
  try {
    const me = await requireAdmin('content');
    if (!findCountry(id)) return { ok: false, error: '알 수 없는 국가' };
    const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!m) return { ok: false, error: '유효하지 않은 이미지' };
    const mime = m[1];
    if (!mime.startsWith('image/')) return { ok: false, error: '이미지 파일만 가능합니다.' };
    const buffer = Buffer.from(m[2], 'base64');
    if (buffer.byteLength > 8_000_000) return { ok: false, error: '이미지가 너무 큽니다 (최대 8MB).' };

    const slot = `th-${id}-${themeIndex + 1}`;
    // 고유 파일명(재정렬 시 슬롯 간 파일 덮어쓰기 충돌 방지)
    const file = `cover-${id}-${themeIndex}-${Date.now()}.jpg`;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const up = await fetch(`${url}/storage/v1/object/archive-photos/${file}`, {
      method: 'POST',
      headers: { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': mime, 'x-upsert': 'true' },
      body: new Uint8Array(buffer),
    });
    if (!up.ok) return { ok: false, error: `업로드 실패 (${up.status})` };

    const publicUrl = `${PHOTO_BASE}/${file}`;
    const res = await applyCountryEdit(id, { images: { [slot]: publicUrl } }, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    return { ok: true, url: publicUrl };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** ── 정적 페이지 편집 (콘텐츠 관리자 이상) ── */
export async function savePage(key: PageKey, content: Partial<PageContent>): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    if (!PAGE_KEYS.includes(key)) return { ok: false, error: '알 수 없는 페이지' };
    if (!sb) return { ok: false, error: '백엔드 미연결' };
    const existing = await loadPageEdit(key);
    const merged = { ...existing, ...content };
    const { error } = await sb.from(CONTENT_TABLE).upsert(
      { id: `page_${key}`, data: merged, updated_by: me.email, updated_at: new Date().toISOString() },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/${key}`);
    revalidatePath(`/admin/page/${key}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** ── STORIES 소감문/이야기 (콘텐츠 관리자 이상) ── */
export async function saveStories(list: Story[]): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    if (!sb) return { ok: false, error: '백엔드 미연결' };
    const clean = (Array.isArray(list) ? list : [])
      .filter((s) => (s.title?.trim() || s.body?.trim()))
      .map((s) => ({
        id: s.id || crypto.randomUUID().slice(0, 8),
        title: (s.title ?? '').trim(),
        author: s.author?.trim() || undefined,
        country: s.country?.trim() || undefined,
        date: s.date?.trim() || undefined,
        kind: s.kind,
        body: (s.body ?? '').trim(),
      }));
    const { error } = await sb.from(CONTENT_TABLE).upsert(
      { id: STORIES_KEY, data: { list: clean }, updated_by: me.email, updated_at: new Date().toISOString() },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath('/stories');
    revalidatePath('/admin/stories');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** ── 사이트 설정 (전체 관리자 전용) ── */
async function saveSettingsRaw(patch: Partial<SiteSettings>, byEmail: string): Promise<Result> {
  if (!sb) return { ok: false, error: '백엔드 미연결' };
  const existing = await loadSettingsEdit();
  const merged = { ...existing, ...patch };
  const { error } = await sb.from(CONTENT_TABLE).upsert(
    { id: SETTINGS_KEY, data: merged, updated_by: byEmail, updated_at: new Date().toISOString() },
    { onConflict: 'id' },
  );
  if (error) return { ok: false, error: error.message };
  revalidatePath('/', 'layout');
  revalidatePath('/admin/settings');
  return { ok: true };
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<Result> {
  try {
    const me = await requireAdmin('super');
    return await saveSettingsRaw(patch, me.email);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function uploadLogo(kind: 'color' | 'white', dataUrl: string): Promise<Result & { url?: string }> {
  try {
    const me = await requireAdmin('super');
    const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!m || !m[1].startsWith('image/')) return { ok: false, error: '이미지 파일만 가능합니다.' };
    const buffer = Buffer.from(m[2], 'base64');
    if (buffer.byteLength > 4_000_000) return { ok: false, error: '이미지가 너무 큽니다 (최대 4MB).' };
    const ext = m[1] === 'image/png' ? 'png' : m[1] === 'image/webp' ? 'webp' : m[1] === 'image/svg+xml' ? 'svg' : 'png';
    const path = `site-logo-${kind}.${ext}`;
    const url = await storagePut(path, m[1], buffer);
    if (!url) return { ok: false, error: '업로드 실패' };
    const versioned = `${url}?v=${Date.now()}`;
    const res = await saveSettingsRaw(kind === 'white' ? { logoWhiteUrl: versioned } : { logoUrl: versioned }, me.email);
    if (!res.ok) return res;
    return { ok: true, url: versioned };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** ── 홈 편집 (콘텐츠 관리자 이상) ── */
export async function saveHome(patch: Partial<HomeContent>): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    if (!sb) return { ok: false, error: '백엔드 미연결' };
    const existing = await loadHomeEdit();
    const merged = { ...existing, ...patch };
    const { error } = await sb.from(CONTENT_TABLE).upsert(
      { id: HOME_KEY, data: merged, updated_by: me.email, updated_at: new Date().toISOString() },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath('/');
    revalidatePath('/admin/home');
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** 홈 나라 카드 이미지 교체 → Storage 업로드 + 홈(__home__) cardImages[id] 기록 */
export async function uploadHomeCard(id: string, dataUrl: string): Promise<Result & { url?: string }> {
  try {
    const me = await requireAdmin('content');
    if (!findCountry(id)) return { ok: false, error: '알 수 없는 국가' };
    if (!sb) return { ok: false, error: '백엔드 미연결' };
    const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!m || !m[1].startsWith('image/')) return { ok: false, error: '이미지 파일만 가능합니다.' };
    const buffer = Buffer.from(m[2], 'base64');
    if (buffer.byteLength > 8_000_000) return { ok: false, error: '이미지가 너무 큽니다 (최대 8MB).' };
    const publicUrl = await storagePut(`homecard-${id}-${Date.now()}.jpg`, m[1], buffer);
    if (!publicUrl) return { ok: false, error: '업로드 실패' };

    const existing = await loadHomeEdit();
    const cardImages = { ...(existing.cardImages ?? {}), [id]: publicUrl };
    const { error } = await sb.from(CONTENT_TABLE).upsert(
      { id: HOME_KEY, data: { ...existing, cardImages }, updated_by: me.email, updated_at: new Date().toISOString() },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };
    revalidatePath('/');
    revalidatePath('/admin/home');
    return { ok: true, url: publicUrl };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** ── 방문 시기별 갤러리 (콘텐츠 관리자 이상) ── */
async function storagePut(path: string, mime: string, buffer: Buffer): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const up = await fetch(`${url}/storage/v1/object/archive-photos/${path}`, {
    method: 'POST',
    headers: { apikey: anon, Authorization: `Bearer ${anon}`, 'Content-Type': mime, 'x-upsert': 'true' },
    body: new Uint8Array(buffer),
  });
  return up.ok ? `${PHOTO_BASE}/${path}` : null;
}

export async function addVisit(id: string, label: string, date: string): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    if (!findCountry(id)) return { ok: false, error: '알 수 없는 국가' };
    if (!label.trim()) return { ok: false, error: '제목을 입력하세요.' };
    const edit = await loadCountryEdit(id);
    const visits: Visit[] = [...(edit.visits ?? []), { id: crypto.randomUUID().slice(0, 8), label: label.trim(), date: date.trim() || undefined, photos: [] }];
    const res = await applyCountryEdit(id, { visits }, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    revalidatePath('/admin/' + id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function removeVisit(id: string, visitId: string): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    const edit = await loadCountryEdit(id);
    const visits = (edit.visits ?? []).filter((v) => v.id !== visitId);
    const res = await applyCountryEdit(id, { visits }, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    revalidatePath('/admin/' + id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function addVisitPhotos(id: string, visitId: string, dataUrls: string[]): Promise<Result & { added?: number }> {
  try {
    const me = await requireAdmin('content');
    const edit = await loadCountryEdit(id);
    const visits = [...(edit.visits ?? [])];
    const vi = visits.findIndex((v) => v.id === visitId);
    if (vi < 0) return { ok: false, error: '방문 항목을 찾을 수 없습니다.' };
    const urls: string[] = [];
    let n = 0;
    for (const dataUrl of dataUrls.slice(0, 30)) {
      const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!m || !m[1].startsWith('image/')) continue;
      const buffer = Buffer.from(m[2], 'base64');
      if (buffer.byteLength > 8_000_000) continue;
      const path = `visit-${id}-${visitId}-${Date.now()}-${n++}.jpg`;
      const url = await storagePut(path, m[1], buffer);
      if (url) urls.push(url);
    }
    if (!urls.length) return { ok: false, error: '업로드된 사진이 없습니다.' };
    visits[vi] = { ...visits[vi], photos: [...visits[vi].photos, ...urls] };
    const res = await applyCountryEdit(id, { visits }, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    revalidatePath('/admin/' + id);
    return { ok: true, added: urls.length };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** ── 카테고리 갤러리 사진 (콘텐츠 관리자 이상) ── */
export async function addCatPhotos(id: string, themeIndex: number, dataUrls: string[]): Promise<Result & { added?: number }> {
  try {
    const me = await requireAdmin('content');
    if (!findCountry(id)) return { ok: false, error: '알 수 없는 국가' };
    const edit = await loadCountryEdit(id);
    const catPhotos = { ...(edit.catPhotos ?? {}) };
    const key = String(themeIndex);
    const urls: string[] = [];
    let n = 0;
    for (const dataUrl of dataUrls.slice(0, 30)) {
      const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!m || !m[1].startsWith('image/')) continue;
      const buffer = Buffer.from(m[2], 'base64');
      if (buffer.byteLength > 8_000_000) continue;
      const path = `cat-${id}-${themeIndex}-${Date.now()}-${n++}.jpg`;
      const url = await storagePut(path, m[1], buffer);
      if (url) urls.push(url);
    }
    if (!urls.length) return { ok: false, error: '업로드된 사진이 없습니다.' };
    catPhotos[key] = [...(catPhotos[key] ?? []), ...urls];
    const res = await applyCountryEdit(id, { catPhotos }, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    revalidatePath('/admin/' + id);
    return { ok: true, added: urls.length };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function removeCatPhoto(id: string, themeIndex: number, url: string): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    const edit = await loadCountryEdit(id);
    const catPhotos = { ...(edit.catPhotos ?? {}) };
    const key = String(themeIndex);
    catPhotos[key] = (catPhotos[key] ?? []).filter((p) => p !== url);
    const res = await applyCountryEdit(id, { catPhotos }, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    revalidatePath('/admin/' + id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function removeVisitPhoto(id: string, visitId: string, url: string): Promise<Result> {
  try {
    const me = await requireAdmin('content');
    const edit = await loadCountryEdit(id);
    const visits = [...(edit.visits ?? [])];
    const vi = visits.findIndex((v) => v.id === visitId);
    if (vi < 0) return { ok: false, error: '방문 항목을 찾을 수 없습니다.' };
    visits[vi] = { ...visits[vi], photos: visits[vi].photos.filter((p) => p !== url) };
    const res = await applyCountryEdit(id, { visits }, me.email);
    if (!res.ok) return { ok: false, error: res.error };
    revalidatePath(`/${id}`);
    revalidatePath('/admin/' + id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
