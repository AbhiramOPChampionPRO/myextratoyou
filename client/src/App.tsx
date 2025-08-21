import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { Navigation } from "@/components/navigation";
import { AuthModal } from "@/components/auth-modal";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Donate from "@/pages/donate";
import Browse from "@/pages/browse";
import Help from "@/pages/help";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/donate" component={Donate} />
      <Route path="/browse" component={Browse} />
      <Route path="/help" component={Help} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={AuthModal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="myextratoyou-theme">
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Router />
              <Toaster />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
