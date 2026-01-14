import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function PageLayout({ children, title, description, className }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-0 md:pl-64 min-h-screen">
        <div className={`p-4 md:p-6 lg:p-8 ${className || ""}`}>
          {(title || description) && (
            <header className="mb-6 md:mb-8">
              {title && (
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
