import Link from 'next/link';
import { getUser } from '@/lib/session';
import { getAdmin, listAdmins } from '@/lib/admin';
import { COUNTRIES } from '@/lib/countries';
import { PAGE_KEYS, PAGE_LABEL } from '@/lib/pages';
import AdminManager from './AdminManager';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const [user, admin] = await Promise.all([getUser(), getAdmin()]);

  if (!admin) {
    return (
      <main className="adminwrap">
        <div className="admincard" style={{ textAlign: 'center', maxWidth: 460, margin: '80px auto' }}>
          <h1 style={{ marginTop: 0 }}>관리자 로그인</h1>
          {user ? (
            <p className="muted">
              <b>{user.email}</b> 계정은 관리자 권한이 없습니다.
              <br />전체 관리자에게 권한 추가를 요청하세요.
            </p>
          ) : (
            <p className="muted">드리미학교 관리자 계정으로 로그인하세요.</p>
          )}
          <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'center' }}>
            {!user && <a className="abtn abtn--primary" href="/api/auth/login">드리미로 로그인</a>}
            <Link className="abtn" href="/">사이트로</Link>
          </div>
        </div>
      </main>
    );
  }

  const admins = admin.role === 'super' ? await listAdmins() : [];

  return (
    <main className="adminwrap">
      <header className="adminhead">
        <div>
          <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.2em', color: 'var(--sky)' }}>DREAMY SCHOOL · ADMIN</div>
          <h1 style={{ margin: '4px 0 0' }}>관리자</h1>
        </div>
        <div className="adminhead__right">
          <span className={`rolechip rolechip--${admin.role}`}>{admin.role === 'super' ? '전체 관리자' : '콘텐츠 관리자'}</span>
          <span className="muted">{admin.email}</span>
          <a className="abtn" href="/api/auth/logout">로그아웃</a>
          <Link className="abtn" href="/">사이트</Link>
        </div>
      </header>

      {/* 콘텐츠 편집 */}
      <section className="admincard">
        <h2>페이지 콘텐츠</h2>
        <p className="muted">각 국가 페이지의 소개·카테고리 글·통계·사진을 수정합니다. 저장 즉시 사이트에 반영됩니다.</p>
        <div className="adminlist">
          <Link href="/admin/home" className="adminlist__item">
            <div><b>홈 (첫 화면)</b> <span className="muted">타이틀 · 선교 발자취 · 카드 문구</span></div>
            <span className="adminlist__go">편집 →</span>
          </Link>
          {COUNTRIES.map((c) => (
            <Link key={c.id} href={`/admin/${c.id}`} className="adminlist__item">
              <div>
                <b>{c.ko}</b> <span className="muted">{c.en}</span>
              </div>
              <span className="adminlist__go">편집 →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 메뉴 페이지 */}
      <section className="admincard">
        <h2>메뉴 페이지</h2>
        <p className="muted">상단 메뉴(ABOUT · MISSIONS · STORIES · ARCHIVE) 페이지의 제목·본문을 편집합니다.</p>
        <div className="adminlist">
          {PAGE_KEYS.map((k) => (
            <Link key={k} href={`/admin/pages/${k}`} className="adminlist__item">
              <div><b>{PAGE_LABEL[k]}</b></div>
              <span className="adminlist__go">편집 →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 사이트 설정 (전체 관리자) */}
      {admin.role === 'super' && (
        <section className="admincard">
          <h2>사이트 설정 <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>(전체 관리자 전용)</span></h2>
          <p className="muted">기본 지도 타일 · 로고 · 대표 문구 · 대표 성경구절을 설정합니다.</p>
          <div className="adminlist" style={{ marginTop: 10 }}>
            <Link href="/admin/settings" className="adminlist__item">
              <div><b>사이트 설정</b> <span className="muted">지도·로고·문구·구절</span></div>
              <span className="adminlist__go">설정 →</span>
            </Link>
          </div>
        </section>
      )}

      {/* 관리자 관리 (전체 관리자) */}
      {admin.role === 'super' && <AdminManager admins={admins} meEmail={admin.email} />}

      <p className="muted" style={{ fontSize: 12, marginTop: 20 }}>
        참고: 이 백엔드는 공유(anon) 키만 있어 권한의 최종 차단은 서버 검증으로 합니다. 강한 DB 레벨 차단이 필요하면 포털에 전용 키를 요청하세요.
      </p>
    </main>
  );
}
