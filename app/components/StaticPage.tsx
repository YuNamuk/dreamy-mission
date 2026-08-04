import { getUser } from '@/lib/session';
import { getSettings } from '@/lib/settings';
import { COUNTRIES } from '@/lib/countries';
import { getPage, type PageKey } from '@/lib/pages';
import { getLocale } from '@/lib/i18n';
import { GlobalHeader } from './GlobalHeader';
import Footer from './Footer';
import PageTitleBar, { type MissionTab } from './PageTitleBar';

/** ABOUT·STORIES·MISSIONS·ARCHIVE 공용 셸. children 에 카드/추가 콘텐츠. */
export default async function StaticPage({ pageKey, active, children }: { pageKey: PageKey; active?: string; children?: React.ReactNode }) {
  const locale = await getLocale();
  const [user, settings, page] = await Promise.all([getUser(), getSettings(), getPage(pageKey, locale)]);

  return (
    <main>
      <GlobalHeader user={user} locale={locale} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} />

      <PageTitleBar
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        active={active as MissionTab | undefined}
        locale={locale}
      />

      <section className="section--wide staticpage" style={{ padding: '36px 48px 0' }}>
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
