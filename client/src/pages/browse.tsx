import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Book, User } from "@shared/schema";

interface BookWithSeller extends Book {
  seller: Pick<User, 'id' | 'name' | 'stars' | 'state' | 'district'> | null;
}

export default function Browse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery<BookWithSeller[]>({
    queryKey: ["/api/books"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (bookData: { bookId: string; buyerId: string; sellerId: string }) => {
      return apiRequest("POST", "/api/transactions", bookData);
    },
    onSuccess: () => {
      toast({
        title: "Purchase request sent!",
        description: "The seller has been notified of your interest.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send purchase request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = (book: BookWithSeller) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to purchase books.",
        variant: "destructive",
      });
      return;
    }

    if (!book.seller) {
      toast({
        title: "Error",
        description: "Seller information not available.",
        variant: "destructive",
      });
      return;
    }

    purchaseMutation.mutate({
      bookId: book.id,
      buyerId: user.id,
      sellerId: book.seller.id,
    });
  };

  // Filter out user's own books and books from banned sellers
  const availableBooks = books?.filter(book => 
    book.seller && 
    book.sellerId !== user?.id
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Browse Available Books</h1>
            <p className="text-lg text-muted-foreground">Discover amazing books shared by our community members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-4">Browse Available Books</h1>
          <p className="text-lg text-muted-foreground">Discover amazing books shared by our community members</p>
        </div>
        
        {availableBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold mb-4">No books available right now</h2>
            <p className="text-muted-foreground mb-8">
              Be the first to share a book with the community!
            </p>
            {user && (
              <Button onClick={() => window.location.href = '/donate'}>
                Donate a Book
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                  <div className="text-6xl">📖</div>
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-1">{book.name}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{book.topic}</Badge>
                      <Badge variant="outline">{book.language}</Badge>
                    </div>
                    <div className="text-lg font-bold text-primary">₹{book.price}</div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {book.seller && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="font-semibold text-sm">{book.seller.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ⭐ {book.seller.stars} stars
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {book.seller.district}, {book.seller.state}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchase(book)}
                    disabled={!user || purchaseMutation.isPending}
                  >
                    {purchaseMutation.isPending ? "Sending Request..." : "BUY NOW"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
