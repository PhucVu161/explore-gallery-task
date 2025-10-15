// lib/types.ts
export interface Item {
  id: string;
  title: string;
  image: string; // URL của ảnh
  category: string;
  tags: string[];
  description: string;
  likes: number;
  author: string; // Tên author
  authorImage: string;
  createdAt: string; // ISO date string
}

export interface PaginatedResponse {
  items: Item[];
  total: number;
}

export type SortOption = "trending" | "latest";

export type Category = "fashion" | "nature" | "health" | "animals" | "travel" ;
