import StaticPage from '../components/StaticPage';
import { getStories } from '@/lib/stories';
import { COUNTRIES } from '@/lib/countries';

export const dynamic = 'force-dynamic';

export default async function StoriesPage() {
  const stories = await getStories();
  const koOf = (id?: string) => COUNTRIES.find((c) => c.id === id)?.ko ?? id;

  return (
    <StaticPage pageKey="stories" active="stories">
      <section className="section--wide" style={{ padding: '10px 48px 0' }}>
        {stories.length === 0 ? (
          <p className="muted" style={{ maxWidth: 800 }}>아직 등록된 이야기가 없습니다. 학생들의 소감문과 계획서가 이곳에 차차 담깁니다.</p>
        ) : (
          <div className="storylist">
            {stories.map((s) => (
              <article key={s.id} className="storycard">
                <div className="storycard__meta">
                  {s.kind && <span className="storycard__kind">{s.kind}</span>}
                  {s.country && <span>{koOf(s.country)}</span>}
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
