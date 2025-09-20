import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Advertisement } from "@/components/ui/advertisement";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center fade-in">
          <h1 className="text-6xl font-bold text-primary mb-6">
            Share Knowledge, Build Community
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Welcome to MyExtraToYou - where books find new homes and knowledge spreads freely. 
            Join our community of book lovers who believe in the power of sharing education and stories.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-semibold mb-2">Donate Books</h3>
                <p className="text-muted-foreground">
                  Share your books with others and help spread knowledge in your community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Browse Collection</h3>
                <p className="text-muted-foreground">
                  Discover amazing books available in your area from fellow community members.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Build Community</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded readers and create lasting relationships through books.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <p className="text-lg text-muted-foreground mb-6">Ready to start your journey?</p>
            {user ? (
              <div className="flex gap-4 justify-center">
                <Link href="/donate">
                  <Button size="lg" className="text-lg">
                    Donate a Book
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="outline" className="text-lg">
                    Browse Books
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button size="lg" className="text-lg transform hover:scale-105 transition-all duration-300">
                  Join Our Community
                </Button>
              </Link>
            )}
          </div>

          {/* Advertisement Section */}
          <div className="mt-16 max-w-md mx-auto">
            <Advertisement size="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}
