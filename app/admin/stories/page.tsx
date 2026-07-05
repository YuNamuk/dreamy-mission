import Link from 'next/link';
import { getAdmin } from '@/lib/admin';
import { getStories } from '@/lib/stories';
import { COUNTRIES } from '@/lib/countries';
import { LOCALES, BASE_LOCALE } from '@/lib/locales';
import StoriesEditor from './StoriesEditor';
import AdminLangTabs from '../AdminLangTabs';

export const dynamic = 'force-dynamic';

export default async function AdminStories({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await searchParams;
  const lang = sp.lang && LOCALES.includes(sp.lang) ? sp.lang : BASE_LOCALE;
  const admin = await getAdmin();
  if (!admin) {
    return (
      <main className="adminwrap">
        <div className="admincard" style={{ maxWidth: 460, margin: '80px auto', textAlign: 'center' }}>
          <h1>권한 없음</h1>
          <a className="abtn abtn--primary" href="/api/auth/login">로그인</a>
        </div>
      </main>
    );
  }
  const stories = await getStories(lang);
  const refStories = lang !== BASE_LOCALE ? await getStories(BASE_LOCALE) : undefined;

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>STORIES 편집</div>
          <h1 style={{ margin: '4px 0 0' }}>선교 이야기</h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href="/stories" target="_blank">페이지 보기 ↗</Link>
        </div>
      </header>
      <AdminLangTabs current={lang} />
      {lang !== BASE_LOCALE && <div className="adminlangnote">번역 모드입니다. 한국어 탭에서 만든 이야기의 제목·내용을 번역합니다. (이야기 추가·삭제·나라·종류는 한국어 탭에서)</div>}
      <StoriesEditor key={lang} initial={stories} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko }))} locale={lang} refData={refStories} />
    </main>
  );
}
