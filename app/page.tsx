import Link from 'next/link';
import { getUser } from '@/lib/session';
import { getCountries } from '@/lib/content';
import { getHome } from '@/lib/home';
import { getSettings } from '@/lib/settings';
import { resolvePhoto } from '@/lib/photos';
import Nav from './components/Nav';
import Footer from './components/Footer';
import MapHero from './components/MapHero';
import { IconEducation, IconService, IconCommunity, IconFaith } from './components/icons';

export const dynamic = 'force-dynamic';

const CARD_ORDER = ['mongolia', 'philippines', 'cambodia', 'indonesia', 'india', 'pakistan'];
const DRAW_ICONS = [<IconEducation key="e" size={22} />, <IconCommunity key="c" size={22} />, <IconService key="s" size={22} />, <IconFaith key="f" size={22} />];
const DRAW_SLOTS = ['draw-education', 'draw-community', 'draw-service', 'draw-faith'];

export default async function Home() {
  const [user, countries, home, settings] = await Promise.all([getUser(), getCountries(), getHome(), getSettings()]);
  const byId = Object.fromEntries(countries.map((c) => [c.id, c]));
  const navCountries = countries.map((c) => ({ id: c.id, ko: c.ko, en: c.en }));

  const heroCountries = countries.map((c) => ({
    id: c.id,
    ko: c.ko,
    en: c.en,
    pin: resolvePhoto(`card-${c.id}`),
    summary: home.taglines[c.id] ?? c.intro.slice(0, 60),
    status: c.timeline.length ? { year: c.timeline[c.timeline.length - 1].y, items: c.timeline[c.timeline.length - 1].items.slice(0, 3) } : undefined,
  }));

  const journey = home.journey
    .filter((j) => byId[j.id])
    .map((j) => ({ y: j.y, id: j.id, ko: byId[j.id].ko, en: byId[j.id].en, desc: j.desc }));

  return (
    <main>
      <Nav user={user} countries={navCountries} active="home" logo={settings.logoUrl} />

      {/* ── 히어로: 풀블리드 지도 + 타이틀(좌)·발자취(우) 오버레이 ── */}
      <div id="map">
        <MapHero
          countries={heroCountries}
          journey={journey}
          hero={{ l1: home.heroLine1, l2: home.heroLine2, l3: home.heroLine3, sub: home.heroSub }}
          defaultLayer={settings.mapTile}
        />
      </div>

      {/* ── 다크 포토 국가 카드 ── */}
      <div id="stories" className="country-cards">
        {CARD_ORDER.map((id) => {
          const c = byId[id];
          if (!c) return null;
          const img = resolvePhoto(`card-${id}`) ?? resolvePhoto(`th-${id}-1`);
          return (
            <Link key={id} href={`/${id}`} className="ccard">
              {img && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="ccard__img" />
                  <span className="ccard__scrim" />
                </>
              )}
              <span className="ccard__en">{c.en}</span>
              <span className="ccard__ko">{c.ko}</span>
              <span className="ccard__desc">{home.taglines[id]}</span>
              <span className="ccard__go">자세히 보기 →</span>
            </Link>
          );
        })}
      </div>

      {/* ── 우리가 그리는 세상 ── */}
      <section id="about" className="draws">
        <div className="draws__inner">
          <div className="draws__lead">
            <h2>{home.drawsTitle}</h2>
            <p>{home.drawsSub}</p>
            <Link href="/philippines" className="draws__btn">
              선교 이야기 보기
            </Link>
          </div>
          <div className="draw-cards">
            {home.draws.map((d, i) => {
              const img = resolvePhoto(DRAW_SLOTS[i]);
              return (
                <div key={i} className="dcard">
                  {img && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="dcard__img" />
                      <span className="dcard__scrim" />
                    </>
                  )}
                  {DRAW_ICONS[i]}
                  <b>{d.ko}</b>
                  <span>{d.d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
