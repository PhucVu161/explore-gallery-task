import { NextResponse } from 'next/server';
import { getItemById } from '@/lib/mockData';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const item = getItemById(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}