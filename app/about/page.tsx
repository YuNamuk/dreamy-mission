import StaticPage from '../components/StaticPage';
import AboutThreads from '../components/AboutThreads';
import CtaBand from '../components/CtaBand';
import { getLocale } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const locale = await getLocale();
  return (
    <StaticPage pageKey="about" active="about">
      <AboutThreads />
      <CtaBand ko={locale === 'ko'} />
    </StaticPage>
  );
}
