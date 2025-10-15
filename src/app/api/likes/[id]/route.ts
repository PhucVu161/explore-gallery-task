import { NextResponse } from 'next/server';
import { incrementLike } from '@/lib/mockData';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const item = incrementLike(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}