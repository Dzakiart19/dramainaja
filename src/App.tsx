import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlatformProvider } from "@/core/context/PlatformContext";
import { Navbar } from "@/components/layout/Navbar";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import RankingPage from "./pages/RankingPage";
import BookmarkPage from "./pages/BookmarkPage";
import DramaDetailPage from "./pages/DramaDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlatformProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/rank" element={<RankingPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            <Route path="/drama/:id" element={<DramaDetailPage />} />
            <Route path="/latest" element={<HomePage />} />
            <Route path="/trending" element={<RankingPage />} />
            <Route path="/categories" element={<HomePage />} />
            <Route path="/discover" element={<HomePage />} />
            <Route path="/foryou" element={<HomePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PlatformProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
