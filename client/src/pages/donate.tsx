import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Advertisement } from "@/components/ui/advertisement";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Donate() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Handle image upload
    const imageFile = formData.get("bookPhoto") as File;
    let imageData = null;
    
    if (imageFile && imageFile.size > 0) {
      // Convert image to base64
      const reader = new FileReader();
      imageData = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const bookData = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      condition: formData.get("condition") as string,
      description: formData.get("description") as string,
      donatedBy: formData.get("fullName") as string,
      donorEmail: formData.get("email") as string,
      donorPhone: formData.get("phone") as string,
      location: `${user.district}, ${user.state}`,
      image: imageData
    };

    try {
      await apiRequest("POST", "/api/books", bookData);
      
      // Invalidate and refetch books data so browse page updates immediately
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      
      // Show alert message
      alert("Book donated successfully! Your book will appear in the browse section shortly.");
      
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

  const categories = ["Fiction", "Non fiction", "Science", "Story books", "Biography", "Textbook"];
  const conditions = [
    "Excellent- Like new",
    "Good- Minor wear",
    "Fair- some wear and tear",
    "Poor- Heavily used but readable"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-4">Donate a Book</h1>
          <p className="text-lg text-muted-foreground">Share your knowledge with the community</p>
        </div>
        
        {/* Top Banner Ad */}
        <div className="mb-8 max-w-4xl mx-auto">
          <Advertisement size="banner" />
        </div>
        
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Book Information Column */}
            <Card>
              <CardHeader>
                <CardTitle>Book Information</CardTitle>
                <CardDescription>
                  Fill in the details about the book you want to donate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Enter book title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    name="author"
                    required
                    placeholder="Enter author name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select name="condition" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Brief description about the book"
                  />
                </div>
                
              </CardContent>
            </Card>

            {/* Your Information Column */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Your contact details for interested buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    defaultValue={user.name}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={user.email}
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    defaultValue={user.mobile}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bookPhoto">Book Photo (Optional)</Label>
                  <Input
                    id="bookPhoto"
                    name="bookPhoto"
                    type="file"
                    accept="image/*"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a photo of your book
                  </p>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Donating Book..." : "Donate Book"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
          
          {/* Bottom Ad */}
          <div className="mt-12 max-w-md mx-auto">
            <Advertisement size="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}
