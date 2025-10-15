'use client';

import { useItems } from '@/app/hooks/useItems';
import Link from 'next/link';
import ItemCard from './ItemCard';

export default function ItemList() {
  const { data, isLoading } = useItems();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {data.items.map((item: any) => (
        <Link href={`/item/${item.id}`} key={item.id}>
          <ItemCard imageUrl={item.image} title={item.title} />
        </Link>
      ))}
    </div>
  );
}