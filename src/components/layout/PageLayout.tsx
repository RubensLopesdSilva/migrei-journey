import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function PageLayout({ children, title, description, className }: PageLayoutProps) {
  return (
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
  );
}
