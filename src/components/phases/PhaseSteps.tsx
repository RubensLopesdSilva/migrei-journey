import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhaseStep {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PhaseStepsProps {
  steps: PhaseStep[];
  activeStep: string;
  onStepChange: (step: string) => void;
  completedSteps?: number;
  phaseColor?: string;
}

export function PhaseSteps({ 
  steps, 
  activeStep, 
  onStepChange, 
  completedSteps = 0,
  phaseColor = "hsl(var(--primary))"
}: PhaseStepsProps) {
  const activeIndex = steps.findIndex(s => s.key === activeStep);

  return (
    <div className="w-full">
      {/* Desktop Version */}
      <div className="hidden md:flex items-center justify-between relative px-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === activeStep;
          const isCompleted = index < completedSteps;
          const isPast = index < activeIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => onStepChange(step.key)}
                className={cn(
                  "flex flex-col items-center gap-2 relative z-10 group transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg p-2"
                )}
              >
                {/* Step Circle */}
                <motion.div
                  className={cn(
                    "h-11 w-11 rounded-full flex items-center justify-center transition-all duration-200",
                    "border-2 shadow-sm bg-background",
                    isActive && "shadow-lg scale-110",
                    !isActive && !isCompleted && !isPast && "bg-muted border-muted-foreground/20",
                    (isCompleted || isPast) && !isActive && "border-transparent"
                  )}
                  style={{
                    backgroundColor: isActive ? phaseColor : (isCompleted || isPast) ? `${phaseColor}20` : undefined,
                    borderColor: isActive ? phaseColor : (isCompleted || isPast) ? phaseColor : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" style={{ color: phaseColor }} />
                  ) : (
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : (isPast ? "text-primary" : "text-muted-foreground")
                      )}
                    />
                  )}
                </motion.div>

                {/* Step Label */}
                <span 
                  className={cn(
                    "text-xs font-medium transition-colors text-center max-w-[80px]",
                    isActive ? "font-semibold" : "text-muted-foreground",
                    "group-hover:text-foreground"
                  )}
                  style={{ color: isActive ? phaseColor : undefined }}
                >
                  {step.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 h-1 w-1 rounded-full"
                    style={{ backgroundColor: phaseColor }}
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>

              {/* Connecting Line - between circles, not through them */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 relative self-start mt-[1.625rem]">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-muted rounded-full" />
                  {/* Active line */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: phaseColor }}
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: isPast ? "100%" : "0%" 
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Version - Compact Pills */}
      <div className="md:hidden">
        <div className="flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === activeStep;
            const isCompleted = index < completedSteps;

            return (
              <button
                key={step.key}
                onClick={() => onStepChange(step.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap",
                  "text-xs font-medium flex-1 justify-center min-w-0",
                  isActive 
                    ? "bg-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                style={{
                  color: isActive ? phaseColor : undefined
                }}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: phaseColor }} />
                ) : (
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Progress Indicator */}
        <div className="mt-3 flex items-center gap-2 px-1">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: phaseColor }}
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((activeIndex + 1) / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {activeIndex + 1}/{steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
