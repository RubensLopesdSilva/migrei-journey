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
  /** If true, only allows navigation to completed steps and current step */
  lockSequential?: boolean;
}

export function PhaseSteps({ 
  steps, 
  activeStep, 
  onStepChange, 
  completedSteps = 0,
  phaseColor = "hsl(var(--primary))",
  lockSequential = false
}: PhaseStepsProps) {
  const activeIndex = steps.findIndex(s => s.key === activeStep);

  const canNavigate = (index: number) => {
    if (!lockSequential) return true;
    // Can navigate to completed steps or the next available step
    return index <= completedSteps;
  };

  const handleStepClick = (step: string, index: number) => {
    if (canNavigate(index)) {
      onStepChange(step);
    }
  };

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
          const isLocked = lockSequential && !canNavigate(index);

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => handleStepClick(step.key, index)}
                disabled={isLocked}
                className={cn(
                  "flex flex-col items-center gap-2 relative z-10 group transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg p-2",
                  isLocked && "opacity-40 cursor-not-allowed"
                )}
              >
                {/* Step Circle */}
                <motion.div
                  className={cn(
                    "h-11 w-11 rounded-full flex items-center justify-center transition-all duration-200",
                    "border-2 shadow-sm bg-background",
                    isActive && "shadow-lg scale-110",
                    !isActive && !isCompleted && !isPast && "bg-muted border-muted-foreground/20",
                    (isCompleted || isPast) && !isActive && "border-transparent",
                    isLocked && "bg-muted/50"
                  )}
                  style={{
                    backgroundColor: isLocked ? undefined : (isActive ? phaseColor : (isCompleted || isPast) ? `${phaseColor}20` : undefined),
                    borderColor: isLocked ? undefined : (isActive ? phaseColor : (isCompleted || isPast) ? phaseColor : undefined),
                  }}
                  whileHover={!isLocked ? { scale: 1.05 } : undefined}
                  whileTap={!isLocked ? { scale: 0.95 } : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" style={{ color: phaseColor }} />
                  ) : (
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : (isPast ? "text-primary" : "text-muted-foreground"),
                        isLocked && "text-muted-foreground/50"
                      )}
                    />
                  )}
                </motion.div>

                {/* Step Label */}
                <span 
                  className={cn(
                    "text-xs font-medium transition-colors text-center max-w-[80px]",
                    isActive ? "font-semibold" : "text-muted-foreground",
                    !isLocked && "group-hover:text-foreground",
                    isLocked && "text-muted-foreground/50"
                  )}
                  style={{ color: isActive && !isLocked ? phaseColor : undefined }}
                >
                  {step.label}
                </span>

                {/* Lock indicator */}
                {isLocked && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-muted border flex items-center justify-center">
                    <span className="text-[8px]">🔒</span>
                  </div>
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
            const isLocked = lockSequential && !canNavigate(index);

            return (
              <button
                key={step.key}
                onClick={() => handleStepClick(step.key, index)}
                disabled={isLocked}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap",
                  "text-xs font-medium flex-1 justify-center min-w-0",
                  isActive 
                    ? "bg-background shadow-sm" 
                    : "text-muted-foreground hover:text-foreground",
                  isLocked && "opacity-40 cursor-not-allowed"
                )}
                style={{
                  color: isActive && !isLocked ? phaseColor : undefined
                }}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 shrink-0" style={{ color: phaseColor }} />
                ) : isLocked ? (
                  <span className="text-[10px] shrink-0">🔒</span>
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
