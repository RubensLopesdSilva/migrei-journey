import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

// Routes that should NOT show the sidebar
const noSidebarRoutes = ["/auth", "/landing"];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar is rendered once and persists across route changes */}
      <Sidebar />
      
      {/* Main content area - only this changes during navigation */}
      <main id="main-content" className="flex-1 pl-0 md:pl-64 min-h-screen pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
