'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getRelatedItems } from '@/lib/mockData';
import Item from '@/components/shared/Item';

// Fetch function cho item detail
const fetchItemDetail = async (id: string) => {
  const res = await fetch(`/api/items/${id}`);
  if (!res.ok) throw new Error('Item not found');
  return res.json();
};

export default function ItemDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query chính: Lấy item detail
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => fetchItemDetail(id),
  });

  // Mutation: Like item (optimistic update)
  const likeMutation = useMutation({
    mutationFn: (itemId: string) => fetch(`/api/likes/${itemId}`, { method: 'POST' }),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['item', itemId] });
      const previousItem = queryClient.getQueryData(['item', itemId]);
      queryClient.setQueryData(['item', itemId], (old: any) => ({ ...old, likes: old.likes + 1 }));
      return { previousItem };
    },
    onError: (err, itemId, context) => {
      queryClient.setQueryData(['item', itemId], context?.previousItem);
    },
    onSettled: (itemId) => {
      queryClient.invalidateQueries({ queryKey: ['item', itemId] });
    },
  });

  // Query: Related items (same category)
  const { data: relatedItems } = useQuery({
    queryKey: ['related', item?.category],
    queryFn: () => getRelatedItems(item?.category || '', id, 4),
    enabled: !!item?.category,
  });

  if (isLoading) return <ItemDetailSkeleton />;
  if (error || !item) return <ItemDetailError onBack={() => router.push('/')} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Main Item Detail - Ảnh 3/5 width */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-6">
        {/* Image - chiếm 3/5 width trên desktop */}
        <div className="lg:col-span-3 aspect-square rounded-lg overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-116 object-contain"
            loading="eager"
          />
        </div>

        {/* Info - chiếm 2/5 width trên desktop */}
        <div className="lg:col-span-2">
          <Card className="w-full h-116">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">By {item.author}</span>
                <Badge variant="secondary">{item.category}</Badge>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Likes */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeMutation.mutate(id)}
                className="flex items-center gap-2"
                disabled={likeMutation.isPending}
                aria-label={`Like ${item.title}, ${item.likes} likes`}
              >
                {likeMutation.isPending ? (
                  <Heart className="h-4 w-4 animate-pulse" />
                ) : (
                  <Heart className="h-4 w-4 fill-current text-red-500" />
                )}
                <span>{item.likes} likes</span>
              </Button>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Items */}
      {relatedItems && relatedItems.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">More from {item.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedItems.map((relatedItem) => (
              <Item key={relatedItem.id} imageUrl={relatedItem.image} title={relatedItem.title} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Skeleton Loading - Cập nhật theo layout mới
function ItemDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image skeleton - 3/5 width */}
        <Skeleton className="lg:col-span-3 aspect-square rounded-lg" />
        
        {/* Info skeleton - 2/5 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Error State - Không đổi
function ItemDetailError({ onBack }: { onBack: () => void }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist.</p>
          <Button onClick={onBack}>Back to Explore</Button>
        </CardContent>
      </Card>
    </div>
  );
}