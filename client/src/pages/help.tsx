import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Help() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to submit a help request.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const helpData = {
      issueType: formData.get("issueType") as string,
      subject: formData.get("subject") as string,
      description: formData.get("description") as string,
      userId: user.id,
    };

    try {
      await apiRequest("POST", "/api/help", helpData);
      toast({
        title: "Help request submitted!",
        description: "We will get back to you soon.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit help request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const issueTypes = [
    { value: "payment", label: "Payment Issue" },
    { value: "account", label: "Account Problem" },
    { value: "book", label: "Book Related" },
    { value: "technical", label: "Technical Issue" },
    { value: "other", label: "Other" },
  ];

  const faqs = [
    {
      question: "How do I donate a book?",
      answer: "Simply click on the 'Donate' menu item, fill out the book details form, upload photos, and set your price. Your book will be visible to the community immediately."
    },
    {
      question: "How does the rating system work?",
      answer: "Sellers gain +1 star for each purchase, lose -1 star for each rejection. Users with 5+ rejections get temporarily banned to maintain quality."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we only share your contact information with buyers when they purchase your books. All other information remains private."
    },
    {
      question: "What happens after someone wants to buy my book?",
      answer: "You'll receive an email notification with the buyer's contact details. You can then coordinate the exchange directly with them."
    },
    {
      question: "How do I update my profile?",
      answer: "Click on your profile picture in the top-right corner and select 'Edit Profile' to update your information."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-lg text-muted-foreground">We're here to help you with any questions</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about MyExtraToYou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issueType">Issue Type</Label>
                  <Select name="issueType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Issue Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !user}
                >
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
                
                {!user && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please login to submit a help request
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Help Resources */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-6">Need More Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get in touch with our support team directly
              </p>
              <p className="text-sm font-medium">support@myextratoyou.com</p>
            </Card>
            
            <Card className="p-6">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="font-semibold mb-2">Community Forum</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with other users and share experiences
              </p>
              <Button variant="outline" size="sm">Coming Soon</Button>
            </Card>
            
            <Card className="p-6">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Mobile App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download our mobile app for easier access
              </p>
              <Button variant="outline" size="sm">Coming Soon</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
