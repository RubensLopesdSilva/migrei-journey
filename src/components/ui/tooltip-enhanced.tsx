import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface TooltipEnhancedProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

export function TooltipEnhanced({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: TooltipEnhancedProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className={cn(
          "max-w-xs px-3 py-2 text-sm shadow-lg animate-in fade-in-0 zoom-in-95",
          className
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

// Info tooltip with icon
interface InfoTooltipProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  iconClassName?: string;
}

export function InfoTooltip({
  content,
  side = "top",
  className,
  iconClassName,
}: InfoTooltipProps) {
  return (
    <TooltipEnhanced content={content} side={side} className={className}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          iconClassName
        )}
        aria-label="Mais informações"
      >
        <Info className="h-4 w-4" />
      </button>
    </TooltipEnhanced>
  );
}

// Stat tooltip specifically for dashboard stats
interface StatTooltipProps {
  label: string;
  value: string | number;
  description: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  children: React.ReactNode;
}

export function StatTooltip({
  label,
  value,
  description,
  trend,
  children,
}: StatTooltipProps) {
  return (
    <TooltipEnhanced
      content={
        <div className="space-y-2">
          <div>
            <p className="font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "font-medium",
                  trend.positive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.positive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      }
      side="bottom"
      delayDuration={300}
    >
      {children}
    </TooltipEnhanced>
  );
}
