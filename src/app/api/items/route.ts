import { NextResponse } from 'next/server';
import { getMockItems, addMockItem } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'latest';

  const response = getMockItems({ page, limit: 12, search, category, sort });
  
  const totalItems = getMockItems({ page: 1, limit: 9999, search, category, sort }).items.length;
  const hasMore = (page * 12) < totalItems;
  
  return NextResponse.json({ 
    ...response, 
    hasMore // nhận biết còn dữ liệu hay không
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newItem = addMockItem(body);
  return NextResponse.json(newItem, { status: 201 });
}