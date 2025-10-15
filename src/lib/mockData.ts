import { Item, Category } from "./types";
import pixabayData from '@/lib/pixabayData.json';

// Danh sách categories cố định
export const categories: Category[] = [
  "fashion",
  "nature",
  "health",
  "animals",
  "travel",
];

// Mock data ban đầu
let mockItems: Item[] = pixabayData.hits.map((hit, index) => {
  const category = categories[Math.floor(Math.random() * categories.length)];

  return {
    id: crypto.randomUUID(),
    title: `Item about ${category} ${index + 1}`,
    image: hit.webformatURL,
    category,
    tags: hit.tags.split(',').map(tag => tag.trim()),
    description: `Picture of Pixabay: content about ${category} includes ${hit.tags}`,
    likes: hit.likes,
    author: hit.user,
    authorImage: hit.userImageURL,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  };
});

// Hàm lấy mock items với filter, sort, pagination
export const getMockItems = ({
  page = 1,
  limit = 12,
  search = "",
  category = "",
  sort = "latest",
  summaryOnly = true, // ✅ thêm tùy chọn
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  summaryOnly?: boolean;
}): { items: Partial<Item>[]; total: number } => {
  let filtered = [...mockItems];

  if (search) {
    filtered = filtered.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (sort === "trending") {
    filtered.sort((a, b) => b.likes - a.likes);
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const items = summaryOnly
    ? paginated.map(({ id, title, image, likes, createdAt }) => ({ id, title, image, likes, createdAt }))
    : paginated;

  return { items, total: filtered.length };
};

// Hàm lấy item theo ID
export const getItemById = (id: string): Item | null => {
  return mockItems.find((i) => i.id === id) || null;
};

// Hàm thêm item mới
export const addMockItem = (
  newItem: Omit<Item, "id" | "likes" | "createdAt">
): Item => {
  const item: Item = {
    id: crypto.randomUUID(),
    ...newItem,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  mockItems.push(item);
  return item;
};

// Hàm tăng like
export const incrementLike = (id: string): Item | null => {
  const item = mockItems.find((i) => i.id === id);
  if (item) {
    item.likes += 1;
    return item;
  }
  return null;
};

// Hàm lấy related items (cùng category, trừ item hiện tại)
export const getRelatedItems = (
  category: string,
  currentId: string,
  limit = 4
): Item[] => {
  return mockItems
    .filter((item) => item.category === category && item.id !== currentId)
    .slice(0, limit);
};
