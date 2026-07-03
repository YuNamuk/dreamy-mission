import Link from 'next/link';
import { getUser } from '@/lib/session';
import { getAdmin, listAdmins } from '@/lib/admin';
import { COUNTRIES } from '@/lib/countries';
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
          <h1 style={{ margin: '4px 0 0' }}>개요</h1>
        </div>
      </header>

      <section className="admincard">
        <h2>환영합니다, {admin.email.split('@')[0]}님</h2>
        <p className="muted">왼쪽 메뉴에서 편집할 영역을 선택하세요. 모든 변경은 <b>저장 즉시 사이트에 반영</b>됩니다.</p>
        <div className="adminlist" style={{ marginTop: 14 }}>
          <Link href="/admin/home" className="adminlist__item">
            <div><b>홈 화면</b> <span className="muted">히어로 · 선교 발자취 · 나라 카드 · 우리가 그리는 세상</span></div>
            <span className="adminlist__go">편집 →</span>
          </Link>
          <Link href={`/admin/${COUNTRIES[0].id}`} className="adminlist__item">
            <div><b>선교지 상세 ({COUNTRIES.length}개국)</b> <span className="muted">소개 · 국가정보 · 카테고리(사진) · 연혁 · 방문 갤러리</span></div>
            <span className="adminlist__go">편집 →</span>
          </Link>
          <Link href="/admin/stories" className="adminlist__item">
            <div><b>STORIES 이야기</b> <span className="muted">학생 소감문 · 계획서 · 현장 이야기</span></div>
            <span className="adminlist__go">편집 →</span>
          </Link>
        </div>
      </section>

      {admin.role === 'super' && (
        <section className="admincard" style={{ marginTop: 16 }}>
          <h2>사이트 설정 <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>(전체 관리자 전용)</span></h2>
          <p className="muted">기본 지도 타일 · 로고 · 대표 문구 · 대표 성경구절.</p>
          <div className="adminlist" style={{ marginTop: 10 }}>
            <Link href="/admin/settings" className="adminlist__item">
              <div><b>사이트 설정</b> <span className="muted">지도·로고·문구·구절</span></div>
              <span className="adminlist__go">설정 →</span>
            </Link>
          </div>
        </section>
      )}

      {admin.role === 'super' && <AdminManager admins={admins} meEmail={admin.email} />}

      <p className="muted" style={{ fontSize: 12, marginTop: 20 }}>
        참고: 이 백엔드는 공유(anon) 키만 있어 권한의 최종 차단은 서버 검증으로 합니다. 강한 DB 레벨 차단이 필요하면 포털에 전용 키를 요청하세요.
      </p>
    </main>
  );
}
