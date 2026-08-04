import { getUser } from '@/lib/session';
import { getSettings } from '@/lib/settings';
import { COUNTRIES } from '@/lib/countries';
import { getLocale } from '@/lib/i18n';
import { GlobalHeader } from '../components/GlobalHeader';
import Footer from '../components/Footer';
import PageTitleBar from '../components/PageTitleBar';
import CtaBand from '../components/CtaBand';

export const dynamic = 'force-dynamic';

/**
 * SUPPORT · 함께하기 — 홈페이지 '교육선교' 하위 항목(후원·소식지·해외 파트너)을 mission UI로 편입한 페이지.
 * 내부 링크는 홈페이지 절대경로(<a>, basePath 미적용) — 같은 도메인 프록시(/mission/*) 전제.
 */
const GROUPS: { title: string; sub: string; items: { name: string; desc: string; href: string; external?: boolean }[] }[] = [
  {
    title: '후원으로 함께하기',
    sub: '드리미의 교육선교는 후원자들의 동행으로 이어집니다.',
    items: [
      { name: '필리핀 드리미학교 장학 후원', desc: '필리핀 드리미학교 학생들의 배움을 잇는 장학 후원', href: '/together/philippines' },
      { name: '필리핀 어린이 그림책 후원', desc: '어린이들에게 모국어 그림책을 전하는 후원', href: '/together/picturebooks' },
    ],
  },
  {
    title: '소식으로 함께하기',
    sub: '교육선교와 학교의 소식을 받아보세요.',
    items: [
      { name: '드리미 소식지', desc: 'Dreamy NOW — 드리미학교가 전하는 소식', href: '/plaza/newsletter' },
      { name: 'Dreamy School 소식지', desc: '드리미스쿨 소식지 아카이브', href: '/plaza/newsletter-dreamyschool' },
    ],
  },
  {
    title: '해외 파트너',
    sub: '드리미와 함께 걷는 해외 학교·공동체입니다.',
    items: [
      { name: 'YWAM-Tyler', desc: '미국 타일러 — 협력 공동체 소식', href: 'https://same-leather-ba9.notion.site/2-e8ff5c67a2744eff8003beb4103056a7', external: true },
      { name: 'Bright Future Global Academy', desc: '협력 학교 소식', href: 'https://same-leather-ba9.notion.site/2be468007e7f448d8f864cfd82153300', external: true },
      { name: 'Dreamy School Philippines', desc: '필리핀 드리미학교 소식', href: 'https://same-leather-ba9.notion.site/47141aa191f747158b5ae952f344d45e', external: true },
      { name: 'Cambodia Dream Ville', desc: '캄보디아 드림빌 이야기', href: 'https://drive.google.com/file/d/1EGIzIfDaB2hvNTCgbErvZz5AzSDCh--0/view?usp=sharing', external: true },
    ],
  },
];

export default async function SupportPage() {
  const locale = await getLocale();
  const [user, settings] = await Promise.all([getUser(), getSettings()]);

  return (
    <main>
      <GlobalHeader user={user} locale={locale} countries={COUNTRIES.map((c) => ({ id: c.id, ko: c.ko, en: c.en }))} />

      <PageTitleBar
        eyebrow="TOGETHER · 함께하는 교육선교"
        title="함께하기"
        subtitle="후원과 소식, 해외 파트너 — 드리미 교육선교에 동행하는 길입니다."
        active="support"
        locale={locale}
      />

      <section className="section--wide staticpage" style={{ padding: '36px 48px 64px' }}>
        {GROUPS.map((g) => (
          <div key={g.title} className="sup__group">
            <h2 className="sup__h">{g.title}</h2>
            <p className="sup__sub">{g.sub}</p>
            <div className="sup__grid">
              {g.items.map((it) => (
                <a key={it.name} href={it.href} className="sup__card" target={it.external ? '_blank' : undefined} rel={it.external ? 'noopener noreferrer' : undefined}>
                  <b>{it.name}{it.external && <span className="sup__ext" aria-hidden> ↗</span>}</b>
                  <span>{it.desc}</span>
                  <span className="sup__go">{locale === 'ko' ? '자세히 보기' : 'View'} →</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <CtaBand ko={locale === 'ko'} />
      <Footer />
    </main>
  );
}
