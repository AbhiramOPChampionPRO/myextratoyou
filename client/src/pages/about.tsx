import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold mb-6">About MyExtraToYou</h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              MyExtraToYou is more than just a book sharing platform - it's a movement towards accessible education and community building. 
              We believe that knowledge should be freely shared, and every book has the potential to change someone's life.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To create a sustainable ecosystem where books circulate freely within communities, 
                    making quality education and literature accessible to everyone, regardless of economic background.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Simply sign up, browse available books in your area, or donate books you've finished reading. 
                    Our rating system ensures quality exchanges and builds trust within the community.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-semibold mb-6">Why Choose MyExtraToYou?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6">
                  <div className="text-3xl mb-4">🌱</div>
                  <h3 className="font-semibold mb-2">Sustainable</h3>
                  <p className="text-sm text-muted-foreground">
                    Give books a second life and reduce waste while spreading knowledge.
                  </p>
                </div>
                <div className="p-6">
                  <div className="text-3xl mb-4">🔒</div>
                  <h3 className="font-semibold mb-2">Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in rating system and user verification ensure safe transactions.
                  </p>
                </div>
                <div className="p-6">
                  <div className="text-3xl mb-4">🚀</div>
                  <h3 className="font-semibold mb-2">Simple</h3>
                  <p className="text-sm text-muted-foreground">
                    Easy-to-use platform that connects book lovers effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
