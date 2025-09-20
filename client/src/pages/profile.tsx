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
          <Advertisement size="banner" type="moveit" />
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
              
              {/* Rewards System */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-6 rounded-lg mb-6 border">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
                    🌱 Green Rewards Program
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Earn beautiful plant seedlings by sharing knowledge! Every confirmed book donation earns you 1 star.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { stars: 4, reward: "China Aster Seedlings", icon: "🌼", unlocked: user.stars >= 4 },
                    { stars: 10, reward: "Yellow Chrysanthemum Seedlings", icon: "🌻", unlocked: user.stars >= 10 },
                    { stars: 15, reward: "Hybrid Marigold Seedlings", icon: "🌺", unlocked: user.stars >= 15 },
                    { stars: 20, reward: "Petunia Seedlings", icon: "🌸", unlocked: user.stars >= 20 },
                    { stars: 50, reward: "Premium Hybrid Varieties (Climbing Rose, 10 o'clock & Rare Types)", icon: "🌹", unlocked: user.stars >= 50 }
                  ].map((tier, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        tier.unlocked 
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      } border`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${tier.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                          {tier.icon}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${
                            tier.unlocked 
                              ? 'text-green-800 dark:text-green-200' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {tier.reward}
                          </p>
                          <p className={`text-xs ${
                            tier.unlocked 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {tier.stars} stars required
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tier.unlocked ? (
                          <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                            ✓ Unlocked!
                          </span>
                        ) : (
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              {tier.stars - user.stars} more stars
                            </div>
                            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${Math.min((user.stars / tier.stars) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    🌟 Partner with <span className="font-semibold text-green-600">GetGreen Nursery</span> for premium quality seedlings
                  </p>
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
              <Advertisement size="sidebar" type="getgreen" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
