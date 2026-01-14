import { cn } from "@/lib/utils";
import { ReactNode, forwardRef, HTMLAttributes } from "react";

interface FocusRingProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  focusClassName?: string;
}

/**
 * Wrapper component that provides accessible focus indicators
 * Use this around interactive elements that need visible focus states
 */
export const FocusRing = forwardRef<HTMLDivElement, FocusRingProps>(
  ({ children, className, focusClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg",
          focusClassName,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FocusRing.displayName = "FocusRing";

/**
 * Utility CSS classes for consistent focus indicators
 * Apply these to interactive elements for accessibility
 */
export const focusRingClasses = 
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const focusRingClassesInset = 
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

/**
 * Skip to content link for keyboard navigation
 * Place at the beginning of the page
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-[100]",
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-lg font-medium",
        "transition-transform duration-200",
        "focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
    >
      Pular para o conteúdo
    </a>
  );
}

/**
 * Visually hidden text for screen readers
 */
interface VisuallyHiddenProps {
  children: ReactNode;
}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

/**
 * Accessible icon button wrapper
 * Use when an icon is the only content of a button
 */
interface AccessibleIconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  className?: string;
}

export const AccessibleIconButton = forwardRef<HTMLButtonElement, AccessibleIconButtonProps>(
  ({ label, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={cn(
          focusRingClasses,
          "rounded-lg p-2 transition-colors",
          "hover:bg-muted",
          className
        )}
        {...props}
      >
        {children}
        <VisuallyHidden>{label}</VisuallyHidden>
      </button>
    );
  }
);

AccessibleIconButton.displayName = "AccessibleIconButton";
