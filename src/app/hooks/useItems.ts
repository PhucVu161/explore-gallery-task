import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const useItems = () => {
  const searchParams = useSearchParams(); // ✅ Đọc từ URL
  
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'latest';

  return useQuery({
    queryKey: ['items', page, search, category, sort], // ✅ Tự động sync với URL
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        category,
        sort,
      });
      const res = await fetch(`/api/items?${params.toString()}`);
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};