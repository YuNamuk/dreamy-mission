import { getUser } from '@/lib/session';
import { getSettings } from '@/lib/settings';
import { getGallery } from '@/lib/gallery';
import { COUNTRIES } from '@/lib/countries';
import { getLocale, makeT } from '@/lib/i18n';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import GalleryView from './GalleryView';

export const dynamic = 'force-dynamic';

const FLAG: Record<string, string> = { mongolia: '🇲🇳', philippines: '🇵🇭', cambodia: '🇰🇭', indonesia: '🇮🇩', india: '🇮🇳', pakistan: '🇵🇰' };

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ country?: string; month?: string }> }) {
  const [locale, sp] = await Promise.all([getLocale(), searchParams]);
  const t = makeT(locale);
  const [user, settings, all] = await Promise.all([getUser(), getSettings(), getGallery(locale)]);
  const ko = locale === 'ko';

  const cinfo: Record<string, { ko: string; en: string; flag: string }> = Object.fromEntries(
    COUNTRIES.map((c) => [c.id, { ko: c.ko, en: c.en, flag: FLAG[c.id] ?? '' }]),
  );

  const filterCountry = sp.country && COUNTRIES.some((c) => c.id === sp.country) ? sp.country : undefined;
  const filterMonth = sp.month;
  const seasons = all.filter((s) => (!filterCountry || s.country === filterCountry) && (!filterMonth || s.date === filterMonth));

  const tabCountries = COUNTRIES.filter((c) => all.some((s) => s.country === c.id));
  // 월별 아카이브 그룹 (date 기준, 최신순)
  const months = Array.from(new Set(all.map((s) => s.date).filter(Boolean) as string[])).sort().reverse();
  const monthInfo = months.map((m) => ({ m, count: all.filter((s) => s.date === m).reduce((n, s) => n + s.photos.length, 0) }));

  const qs = (o: { country?: string; month?: string }) => {
    const p = new URLSearchParams();
    if (o.country) p.set('country', o.country);
    if (o.month) p.set('month', o.month);
    const s = p.toString();
    return s ? `/gallery?${s}` : '/gallery';
  };

  return (
    <main>
      <Nav user={user} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} active="gallery" logo={settings.logoUrl} locale={locale} />

      <section className="section--wide galhero" style={{ padding: '116px 48px 0' }}>
        <h1 className="galhero__title">{ko ? '선교 사진 아카이브' : 'Mission Photo Archive'}</h1>
        <p className="galhero__sub">{ko ? '드리미학교의 선교 순간들을 나라별·월별로 기록한 사진 아카이브입니다.' : 'A photo archive of Dreamy School’s mission moments, recorded by country and month.'}</p>
        <div className="galhero__label">{ko ? '나라별 정렬 · 월별 기록' : 'By country · by month'}</div>
      </section>

      {/* 필터칩 */}
      <section className="section--wide" style={{ padding: '22px 48px 0' }}>
        <div className="galtabs">
          <a className={`galtab${!filterCountry ? ' is-on' : ''}`} href={qs({ month: filterMonth })}>{ko ? '전체' : 'All'}</a>
          {tabCountries.map((c) => (
            <a key={c.id} className={`galtab${filterCountry === c.id ? ' is-on' : ''}`} href={qs({ country: c.id, month: filterMonth })}>
              <span className="galtab__flag">{FLAG[c.id]}</span>{ko ? c.ko : c.en}
            </a>
          ))}
        </div>
      </section>

      {/* 사이드바 + 그리드 */}
      <section className="section--wide gallayout" style={{ padding: '20px 48px 48px' }}>
        <aside className="galside">
          <div className="galside__hd">{ko ? '월별 아카이브' : 'Monthly archive'}</div>
          <div className="galside__list">
            {monthInfo.length === 0 && <div className="muted" style={{ fontSize: 13, padding: '6px 4px' }}>{ko ? '기록 없음' : 'No records'}</div>}
            {monthInfo.map(({ m, count }) => (
              <a key={m} className={`galside__item${filterMonth === m ? ' is-on' : ''}`} href={qs({ country: filterCountry, month: filterMonth === m ? undefined : m })}>
                <div><b>{m}</b><span>{ko ? '교육선교' : 'Mission'}</span></div>
                <span className="galside__count">{count}</span>
              </a>
            ))}
          </div>
          {(filterCountry || filterMonth) && <a className="galside__all" href="/gallery">{ko ? '전체 아카이브 보기 →' : 'View all →'}</a>}
        </aside>

        <div className="galmain">
          <GalleryView
            seasons={seasons}
            cinfo={cinfo}
            ui={{
              open: ko ? '원본 보기' : 'View original',
              download: ko ? '다운로드' : 'Download',
              downloadAll: ko ? '전체 다운로드' : 'Download all',
              photos: ko ? '장' : 'photos',
              empty: ko ? '이 조건에 해당하는 사진이 없습니다.' : 'No photos match this filter.',
              backToGallery: ko ? '갤러리로 돌아가기' : 'Back to gallery',
              lCountry: ko ? '국가' : 'Country',
              lMonth: ko ? '월' : 'Month',
              lTitle: ko ? '제목' : 'Title',
              lPhoto: ko ? '사진' : 'Photo',
              lPeople: ko ? '참여자' : 'Participants',
            }}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
