import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Advertisement } from "@/components/ui/advertisement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  donatedBy: string;
  donorEmail: string;
  donorPhone: string;
  location: string;
  dateAdded: string;
  status: string;
  book_issued: string;
  image: string | null;
}

export default function Browse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBook, setSelectedBook] = useState<DonatedBook | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const { data: books, isLoading } = useQuery<DonatedBook[]>({
    queryKey: ["/api/books"],
  });

  const requestMutation = useMutation({
    mutationFn: async (requestData: {
      bookId: string;
      bookTitle: string;
      requestorName: string;
      requestorEmail: string;
      requestorPhone?: string;
      requestorMessage?: string;
    }) => {
      return apiRequest("POST", "/api/requests", requestData);
    },
    onSuccess: () => {
      alert("Thank you, Your request has been sent");
      toast({
        title: "Request Sent!",
        description: "Thank you, Your request has been sent",
      });
      setIsRequestModalOpen(false);
      setSelectedBook(null);
      // Refresh the books list to remove the requested book
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRequestBook = (book: DonatedBook) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to request books.",
        variant: "destructive",
      });
      return;
    }

    setSelectedBook(book);
    setIsRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBook) return;

    setIsSubmittingRequest(true);
    const formData = new FormData(e.currentTarget);
    
    const requestData = {
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      requestorName: formData.get("name") as string,
      requestorEmail: formData.get("email") as string,
      requestorPhone: formData.get("phone") as string || undefined,
      requestorMessage: formData.get("message") as string || undefined,
    };

    requestMutation.mutate(requestData);
    setIsSubmittingRequest(false);
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
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-4">Browse Available Books</h1>
          <p className="text-lg text-muted-foreground">Discover amazing books shared by our community members</p>
        </div>
        
        {/* Top Banner Ad */}
        <div className="mb-8">
          <Advertisement size="banner" />
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
          <div className="flex gap-8">
            {/* Books Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableBooks.map((book) => (
                  <Card key={book.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center overflow-hidden">
                  {book.image ? (
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">📖</div>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                  <CardDescription className="space-y-1">
                    <p className="text-sm font-medium">by {book.author}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{book.category}</Badge>
                      <Badge variant="outline">{book.condition}</Badge>
                    </div>
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
                    onClick={() => handleRequestBook(book)}
                    disabled={!user}
                  >
                    Request this book
                  </Button>
                  </CardContent>
                </Card>
              ))}
              </div>
            </div>
            
            {/* Sidebar Ad */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-24">
                <Advertisement size="sidebar" />
              </div>
            </div>
          </div>
        )}

        {/* Request Book Modal */}
        <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Book</DialogTitle>
              <DialogDescription>
                {selectedBook && `Request "${selectedBook.title}" by ${selectedBook.author}`}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={user?.name || ""}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={user?.email || ""}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user?.mobile || ""}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Any additional message for the book owner..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsRequestModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmittingRequest || requestMutation.isPending}
                >
                  {isSubmittingRequest || requestMutation.isPending ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
