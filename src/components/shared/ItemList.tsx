'use client';

import { useInfiniteItems } from '@/app/hooks/useInfiniteItems'; // ← NEW
import Link from 'next/link';
import ItemCard from './ItemCard';
import { useEffect, useRef, useCallback } from 'react';

export default function ItemList() {
  const { 
    data, 
    isLoading, 
    fetchNextPage: loadMore, // ← NEW
    isFetchingNextPage: isLoadingMore, // ← NEW
    hasNextPage: hasMore // ← NEW
  } = useInfiniteItems();

  const sentinelRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  // Flatten all pages items
  const allItems = data?.pages.flatMap(page => page.items) || [];

  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {allItems.map((item: any) => (
          <Link href={`/item/${item.id}`} key={item.id}>
            <ItemCard imageUrl={item.image} title={item.title} />
          </Link>
        ))}
      </div>

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading more */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="text-lg">Loading more...</div>
        </div>
      )}

      {/* End message */}
      {!hasMore && allItems.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="text-gray-500 text-lg">No more items</div>
        </div>
      )}
    </>
  );
}