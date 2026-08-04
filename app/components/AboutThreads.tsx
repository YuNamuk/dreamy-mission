import Link from 'next/link';
import { getCountries } from '@/lib/content';
import { resolvePhoto } from '@/lib/photos';
import { getLocale } from '@/lib/i18n';

/**
 * ABOUT — '드리미학교 선교의 결'.
 * 여섯 나라의 연혁(timeline)에서 같은 결의 일들을 모아 보여준다.
 * ⚠ 근거 문장은 나라 데이터의 연혁 항목을 **그대로** 인용한다(요약·각색 금지).
 *   나라 데이터가 관리자에서 수정되면 이 화면도 자동으로 따라간다.
 */

interface Thread {
  key: string;
  title: string;
  lead: string;
  /** 연혁 항목에서 이 결에 해당하는 것을 고르는 패턴 */
  match: RegExp;
  /** 대표 사진 — 나라 테마 사진 슬롯(th-{country}-{n}) */
  photo: { country: string; n: number };
}

const THREADS: Thread[] = [
  {
    key: 'school',
    title: '학교를 세운다',
    lead: '배움이 끊긴 자리에 학교가 선다. 건물을 올리는 일에서 시작해 교육과정을 함께 짜고, 학년이 하나씩 늘어나는 방식으로 학교는 자란다.',
    // '20개교' 처럼 수량 뒤의 '개교' 가 걸리지 않도록 숫자 뒤는 제외
    match: /(?<![0-9])개교|건축|설립|드림빌|MOU|교육과정 개발|교육과정 계획|12년제|캠퍼스/,
    photo: { country: 'philippines', n: 1 },
  },
  {
    key: 'teacher',
    title: '교사를 세운다',
    lead: '한 교사가 서면 한 교실이 바뀐다. 드리미의 교육선교는 학생보다 먼저 교사를 만나고, 연수와 동행으로 현지 교사들이 스스로 서도록 돕는다.',
    match: /교사 연수|교사연수|연수|세미나|아카데미|코치/,
    photo: { country: 'mongolia', n: 2 },
  },
  {
    key: 'send',
    title: '졸업생을 보낸다',
    lead: '드리미의 졸업생들이 인턴 교사로 파송된다. 배운 사람이 가르치는 자리로 건너가는 이 순환이, 드리미 교육선교의 가장 뚜렷한 결이다.',
    match: /파송/,
    photo: { country: 'philippines', n: 4 },
  },
  {
    key: 'festival',
    title: '함께 배우는 축제를 연다',
    lead: '3P(Play · Performance · Practice)는 드리미의 교육 원리이자 만남의 형식이다. 후원자와 수혜자가 아니라 같은 배움의 파트너로 마주 선다.',
    match: /3P|페스티벌|Festival|축제/,
    photo: { country: 'mongolia', n: 1 },
  },
  {
    key: 'village',
    title: '마을로 들어간다',
    lead: '학교 담장 밖에도 배움이 필요하다. 초원 끝 마을, 쓰레기산 옆 이주촌, 유치원과 도서관 — 아이들이 있는 자리로 찾아간다.',
    match: /지역 선교|캠프|에듀센터|Edu-Center|유치원|도서관|마을|방문 연수|교육선교/,
    photo: { country: 'philippines', n: 3 },
  },
  {
    key: 'legacy',
    title: '배움을 남긴다',
    lead: '한 번의 방문으로 끝나지 않도록, 교재와 책과 교육과정을 남긴다. 남겨진 것들이 우리가 없는 날에도 계속 가르친다.',
    match: /교재|출판|Dreamy Books|그림책|IT|미술|한국어/,
    photo: { country: 'mongolia', n: 3 },
  },
];

interface Evidence { country: string; ko: string; year: string; text: string }

export default async function AboutThreads() {
  const locale = await getLocale();
  const ko = locale !== 'en';
  const countries = await getCountries(locale);

  const photoOf = (t: Thread) =>
    resolvePhoto(`th-${t.photo.country}-${t.photo.n}`) ?? resolvePhoto(`card-${t.photo.country}`);

  /** 결에 해당하는 연혁 항목을 나라별로 최대 1개씩(최근 연도 우선) 모은다. */
  const evidenceFor = (t: Thread): Evidence[] => {
    const out: Evidence[] = [];
    for (const c of countries) {
      const rows = [...(c.timeline ?? [])].reverse(); // 최근 연도부터
      for (const row of rows) {
        const hit = row.items.find((it) => t.match.test(it));
        if (hit) {
          out.push({ country: c.id, ko: ko ? c.ko : c.en, year: row.y, text: hit });
          break;
        }
      }
    }
    return out.slice(0, 4);
  };

  return (
    <section className="threads">
      <div className="section--wide">
        <p className="threads__eyebrow">{ko ? '여섯 나라에서 드러난 결' : 'Threads across six lands'}</p>
        <h2 className="threads__h">{ko ? '드리미학교 선교의 결' : 'The grain of our mission'}</h2>
        <p className="threads__lead">
          {ko
            ? '2016년 파키스탄에서 시작해 몽골·필리핀·캄보디아·인도네시아·인도로 이어진 동행에는 되풀이되는 결이 있다. 아래 문장들은 각 나라 연혁에 실제로 기록된 일들이다.'
            : 'Across six lands, the same threads keep returning. Every line below is quoted from the country chronicles.'}
        </p>

        <div className="threads__list">
          {THREADS.map((t, i) => {
            const ev = evidenceFor(t);
            if (!ev.length) return null;
            const img = photoOf(t);
            return (
              <article key={t.key} className={`thread${i % 2 === 1 ? ' thread--flip' : ''}`}>
                <div className="thread__media">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" loading="lazy" />
                  ) : (
                    <div className="thread__ph" aria-hidden />
                  )}
                </div>
                <div className="thread__body">
                  <span className="thread__no">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="thread__t">{t.title}</h3>
                  <p className="thread__lead">{t.lead}</p>
                  <ul className="thread__ev">
                    {ev.map((e, j) => (
                      <li key={j}>
                        <Link href={`/${e.country}`} className="thread__tag">{e.ko} {e.year}</Link>
                        <span>{e.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
