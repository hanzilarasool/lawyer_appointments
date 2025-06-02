import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/home";
import Admin from "./pages/admin";

function Router() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-law-neutral">
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <Switch>
        <Route path="/" component={() => <Home />} />
        <Route path="/admin" component={() => <Admin setIsAdmin={setIsAdmin} />} />
        <Route component={() => <Home />} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
