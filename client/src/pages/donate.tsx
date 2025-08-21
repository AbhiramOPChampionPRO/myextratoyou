import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Donate() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const bookData = {
      name: formData.get("bookName") as string,
      topic: formData.get("topic") as string,
      language: formData.get("language") as string,
      price: parseInt(formData.get("price") as string),
      images: [], // TODO: Handle file uploads
      sellerId: user.id,
    };

    try {
      await apiRequest("POST", "/api/books", bookData);
      toast({
        title: "Book donated successfully!",
        description: "Your book will appear in the browse section shortly.",
      });
      setLocation("/browse");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to donate book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const languages = ["English", "Hindi", "Tamil", "Malayalam", "Bengali", "Telugu", "Kannada", "Gujarati", "Marathi", "Other"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-4">Donate a Book</h1>
          <p className="text-lg text-muted-foreground">Share your knowledge with the community</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
              <CardDescription>
                Fill in the details about the book you want to donate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bookName">Book Name *</Label>
                    <Input
                      id="bookName"
                      name="bookName"
                      required
                      placeholder="Enter book title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language *</Label>
                    <Select name="language" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic/Genre *</Label>
                    <Input
                      id="topic"
                      name="topic"
                      required
                      placeholder="e.g. Science, Literature, Programming"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      required
                      min="1"
                      placeholder="Set your price"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="images">Book Images</Label>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload up to 5 images of your book
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Donating Book..." : "Donate Book"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
