import StaticPage from '../components/StaticPage';
export const dynamic = 'force-dynamic';
export default function StoriesPage() {
  return <StaticPage pageKey="stories" active="stories" />;
}
