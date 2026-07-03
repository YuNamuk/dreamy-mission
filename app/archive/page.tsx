import StaticPage from '../components/StaticPage';
import CountryCards from '../components/CountryCards';
export const dynamic = 'force-dynamic';
export default function ArchivePage() {
  return (
    <StaticPage pageKey="archive" active="archive">
      <div style={{ marginTop: 8 }}>
        <CountryCards />
      </div>
      <div style={{ height: 40 }} />
    </StaticPage>
  );
}
