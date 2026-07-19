import Link from 'next/link';
import { getAdmin } from '@/lib/admin';
import { loadGalleryRaw } from '@/lib/gallery';
import { COUNTRIES } from '@/lib/countries';
import GalleryEditor from './GalleryEditor';

export const dynamic = 'force-dynamic';

export default async function AdminGallery() {
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
  const { seasons, isSeed } = await loadGalleryRaw();

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>갤러리 편집</div>
          <h1 style={{ margin: '4px 0 0' }}>교육선교 갤러리</h1>
        </div>
        <div className="adminhead__right">
          <Link className="abtn" href="/gallery" target="_blank">페이지 보기 ↗</Link>
        </div>
      </header>
      {isSeed && <div className="adminlangnote">지금 보이는 시즌은 <b>기존 이미지로 만든 더미(샘플)</b>입니다. 아래 <b>전체 일괄 삭제</b> 후 실제 사진으로 시즌을 새로 구성하세요.</div>}
      <GalleryEditor initial={seasons} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko }))} />
    </main>
  );
}
