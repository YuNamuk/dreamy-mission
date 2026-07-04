import StaticPage from '../components/StaticPage';
import { getStories } from '@/lib/stories';
import { COUNTRIES } from '@/lib/countries';
import { getLocale, makeT } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function StoriesPage() {
  const locale = await getLocale();
  const t = makeT(locale);
  const stories = await getStories(locale);
  const cname = (id?: string) => {
    const c = COUNTRIES.find((x) => x.id === id);
    return c ? (locale === 'ko' ? c.ko : c.en) : id;
  };

  return (
    <StaticPage pageKey="stories" active="stories">
      <section className="section--wide" style={{ padding: '10px 48px 0' }}>
        {stories.length === 0 ? (
          <p className="muted" style={{ maxWidth: 800 }}>{t('stories.empty')}</p>
        ) : (
          <div className="storylist">
            {stories.map((s) => (
              <article key={s.id} className="storycard">
                <div className="storycard__meta">
                  {s.kind && <span className="storycard__kind">{t(`story.kind.${s.kind}`) || s.kind}</span>}
                  {s.country && <span>{cname(s.country)}</span>}
                  {s.date && <span>{s.date}</span>}
                </div>
                <h3 className="storycard__title">{s.title}</h3>
                {s.author && <div className="storycard__author">{s.author}</div>}
                <div className="storycard__body">
                  {s.body.split('\n').filter(Boolean).map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </StaticPage>
  );
}
