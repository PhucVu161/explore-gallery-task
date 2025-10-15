// app/page.tsx (Next.js 13+ với App Router)
import FilterBar from '@/components/shared/FilterBar';
import ItemList from '@/components/shared/ItemList';

export default function HomePage() {
  return (
    <>
      <FilterBar />
      <ItemList />
    </>
  );
}