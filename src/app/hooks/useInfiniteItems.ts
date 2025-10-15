// hooks/useInfiniteItems.ts
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useInfiniteItems = () => {
  const searchParams = useSearchParams();
  
  // Lấy các params KHÔNG có page (để fetch cùng filter)
  const baseParams = useCallback(() => {
    const params = new URLSearchParams({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'latest',
    });
    return params.toString();
  }, [searchParams]);

  return useInfiniteQuery({
    queryKey: ['infinite-items', baseParams()],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        ...Object.fromEntries(baseParams().split('&').map(p => p.split('='))),
      });
      const res = await fetch(`/api/items?${params.toString()}`);
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Nếu API trả hasMore = true thì load tiếp
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined; // Dừng infinite scroll
    },
    staleTime: 1000 * 60 * 5,
  });
};