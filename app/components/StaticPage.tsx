import { getUser } from '@/lib/session';
import { getSettings } from '@/lib/settings';
import { COUNTRIES } from '@/lib/countries';
import { getPage, type PageKey } from '@/lib/pages';
import { getLocale } from '@/lib/i18n';
import Nav from './Nav';
import Footer from './Footer';

/** ABOUT·STORIES·MISSIONS·ARCHIVE 공용 셸. children 에 카드/추가 콘텐츠. */
export default async function StaticPage({ pageKey, active, children }: { pageKey: PageKey; active?: string; children?: React.ReactNode }) {
  const locale = await getLocale();
  const [user, settings, page] = await Promise.all([getUser(), getSettings(), getPage(pageKey, locale)]);

  return (
    <main>
      <Nav user={user} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} active={active} logo={settings.logoUrl} locale={locale} />

      <section className="section--wide staticpage" style={{ padding: '128px 48px 0' }}>
        <div className="eyebrow" style={{ fontSize: 12, letterSpacing: '.22em' }}>{page.eyebrow}</div>
        <h1 className="staticpage__title">{page.title}</h1>
        {page.subtitle && <p className="staticpage__sub">{page.subtitle}</p>}

        {page.sections.length > 0 && (
          <div className="staticpage__body">
            {page.sections.map((s, i) => (
              <div key={i} className="pgsec">
                {s.heading && <h2>{s.heading}</h2>}
                {s.body.split('\n').filter(Boolean).map((p, j) => <p key={j}>{p}</p>)}
              </div>
            ))}
          </div>
        )}
      </section>

      {children}

      <Footer />
    </main>
  );
}
