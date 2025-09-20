import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Advertisement } from "@/components/ui/advertisement";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    district: "",
  });

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      state: user.state || "",
      district: user.district || "",
    });
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);

    try {
      const response = await apiRequest("PUT", `/api/user/${user.id}`, formData);
      const updatedUserData = await response.json();
      
      updateUser(updatedUserData);
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const states = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Kerala",
    "Gujarat",
    "West Bengal",
    "Rajasthan",
    "Uttar Pradesh",
    "Madhya Pradesh",
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-4">Edit Profile</h1>
          <p className="text-lg text-muted-foreground">Update your account information</p>
        </div>
        
        {/* Top Banner Ad */}
        <div className="mb-8">
          <Advertisement size="banner" />
        </div>
        
        <div className="flex gap-8">
          <div className="flex-1 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Keep your profile information up to date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* User Stats */}
              <div className="bg-muted p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-lg font-semibold">⭐ {user.stars} stars</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rejections</p>
                    <p className="text-lg font-semibold">{user.rejections}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`text-lg font-semibold ${user.isBanned ? 'text-destructive' : 'text-green-600'}`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => handleInputChange("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating Profile..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
            </Card>
          </div>
          
          {/* Sidebar Ad */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-24">
              <Advertisement size="sidebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
