import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DonatedBook {
  id: string;
  title: string;
  author: string;
  category: string;
  condition: string;
  description: string;
  price: number;
  donatedBy: string;
  donorEmail: string;
  donorPhone: string;
  location: string;
  dateAdded: string;
  status: string;
  image: string | null;
}

export default function Browse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery<DonatedBook[]>({
    queryKey: ["/api/books"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (bookData: { bookId: string; donorEmail: string; donorPhone: string; title: string }) => {
      // For now, we'll just show contact info - in a real app this would send email/SMS
      return Promise.resolve(bookData);
    },
    onSuccess: (data) => {
      toast({
        title: "Contact Information",
        description: `Contact ${data.donorEmail} or ${data.donorPhone} for "${data.title}"`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get contact information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = (book: DonatedBook) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to view contact information.",
        variant: "destructive",
      });
      return;
    }

    purchaseMutation.mutate({
      bookId: book.id,
      donorEmail: book.donorEmail,
      donorPhone: book.donorPhone,
      title: book.title
    });
  };

  // Filter out user's own donated books
  const availableBooks = books?.filter(book => 
    book.donorEmail !== user?.email
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
                  <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                  <CardDescription className="space-y-1">
                    <p className="text-sm font-medium">by {book.author}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{book.category}</Badge>
                      <Badge variant="outline">{book.condition}</Badge>
                    </div>
                    <div className="text-lg font-bold text-primary">₹{book.price}</div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {book.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="font-semibold text-sm">Donated by: {book.donatedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      📍 {book.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📅 {new Date(book.dateAdded).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchase(book)}
                    disabled={!user || purchaseMutation.isPending}
                  >
                    {purchaseMutation.isPending ? "Getting Contact..." : "GET CONTACT INFO"}
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
