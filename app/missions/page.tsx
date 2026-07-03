import StaticPage from '../components/StaticPage';
import CountryCards from '../components/CountryCards';
export const dynamic = 'force-dynamic';
export default function MissionsPage() {
  return (
    <StaticPage pageKey="missions" active="missions">
      <div style={{ marginTop: 8 }}>
        <CountryCards />
      </div>
      <div style={{ height: 40 }} />
    </StaticPage>
  );
}
