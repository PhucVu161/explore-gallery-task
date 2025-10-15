'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { categories } from '@/lib/mockData';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Chỉ useState cho SEARCH (debounce)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  
  // ✅ Đọc trực tiếp từ URL cho category/sort
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'latest';

  // ✅ TRUE DEBOUNCE: Chỉ update URL sau 300ms NGHỈ NHẬP
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      // Chỉ update search nếu khác
      if (params.get('search') !== searchInput) {
        if (searchInput) params.set('search', searchInput);
        else params.delete('search');
        router.replace(`/?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, searchParams, router]);

  return (
    <>
      <div className="flex items-center gap-4 my-4">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} // ✅ Chỉ setState!
          placeholder="Search..."
          className="px-3 py-2 rounded-2xl border-2 border-muted grow"
        />
        <Link href="/create">
          <Button variant="default" className="h-10">Create item</Button>
        </Link>
      </div>

      <div className="flex justify-end items-center gap-4 my-4">
        <select
          value={category}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            if (e.target.value) params.set('category', e.target.value);
            else params.delete('category');
            router.replace(`/?${params.toString()}`);
          }}
          className="p-2 rounded-md bg-muted"
        >
          <option value="">Category: All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            params.set('sort', e.target.value);
            router.replace(`/?${params.toString()}`);
          }}
          className="p-2 rounded-md bg-muted"
        >
          <option value="latest">Sort: Latest</option>
          <option value="trending">Sort: Trending</option>
        </select>
      </div>
    </>
  );
}