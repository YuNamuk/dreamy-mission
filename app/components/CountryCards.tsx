import Link from 'next/link';
import { getCountries } from '@/lib/content';
import { getHome } from '@/lib/home';
import { resolvePhoto } from '@/lib/photos';

const ORDER = ['mongolia', 'philippines', 'cambodia', 'indonesia', 'india', 'pakistan'];

/** 6개국 다크 포토 카드 그리드 (홈·선교지·아카이브 공용). */
export default async function CountryCards() {
  const [countries, home] = await Promise.all([getCountries(), getHome()]);
  const byId = Object.fromEntries(countries.map((c) => [c.id, c]));
  return (
    <div className="country-cards">
      {ORDER.map((id) => {
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
  );
}
