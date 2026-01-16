import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <div className="hidden md:flex items-center justify-center relative py-4">
        {/* Container with proper spacing */}
        <div className="flex items-center justify-between w-full max-w-3xl relative">
          {/* Progress Line Background */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-muted"
            style={{ left: '40px', right: '40px' }}
          />
          
          {/* Progress Line Active */}
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 h-[2px]"
            style={{ 
              backgroundColor: phaseColor,
              left: '40px'
            }}
            initial={{ width: "0%" }}
            animate={{ 
              width: activeIndex > 0 
                ? `calc(${(activeIndex / (steps.length - 1)) * 100}% - 80px * ${activeIndex / (steps.length - 1)})` 
                : "0%"
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === activeStep;
            const isCompleted = index < completedSteps;
            const isPast = index < activeIndex;
            const isFuture = index > activeIndex;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                {/* Active Step Container */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      className="absolute -inset-3 rounded-2xl border-2 bg-background shadow-lg"
                      style={{ borderColor: phaseColor }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      layoutId="activeContainer"
                    />
                  )}
                </AnimatePresence>

                <button
                  onClick={() => onStepChange(step.key)}
                  className={cn(
                    "flex flex-col items-center gap-2 relative transition-all duration-200 p-2",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
                    "group"
                  )}
                >
                  {/* Step Circle */}
                  <motion.div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300",
                      "border-2",
                      isFuture && "bg-muted/50 border-muted-foreground/20"
                    )}
                    style={{
                      backgroundColor: isActive 
                        ? phaseColor 
                        : (isCompleted || isPast) 
                          ? phaseColor 
                          : undefined,
                      borderColor: isActive 
                        ? phaseColor 
                        : (isCompleted || isPast) 
                          ? phaseColor 
                          : undefined,
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Icon 
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive 
                            ? "text-white" 
                            : isPast 
                              ? "text-white" 
                              : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <motion.span 
                    className={cn(
                      "text-xs font-medium transition-all text-center whitespace-nowrap",
                      isActive 
                        ? "font-semibold" 
                        : isPast || isCompleted 
                          ? "text-foreground" 
                          : "text-muted-foreground group-hover:text-foreground"
                    )}
                    style={{ color: isActive ? phaseColor : undefined }}
                  >
                    {step.label}
                  </motion.span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Version - Card Style */}
      <div className="md:hidden">
        <div className="flex gap-2 p-2 bg-muted/50 rounded-xl overflow-x-auto scrollbar-hide">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === activeStep;
            const isCompleted = index < completedSteps;
            const isPast = index < activeIndex;

            return (
              <motion.button
                key={step.key}
                onClick={() => onStepChange(step.key)}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200",
                  "min-w-[70px] flex-shrink-0",
                  isActive 
                    ? "bg-background shadow-md border-2" 
                    : "hover:bg-background/50"
                )}
                style={{
                  borderColor: isActive ? phaseColor : 'transparent'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center transition-all",
                    !isActive && !isPast && !isCompleted && "bg-muted"
                  )}
                  style={{
                    backgroundColor: (isActive || isPast || isCompleted) ? phaseColor : undefined
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Icon 
                      className={cn(
                        "h-4 w-4",
                        (isActive || isPast) ? "text-white" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
                <span 
                  className={cn(
                    "text-[10px] font-medium text-center leading-tight",
                    isActive ? "font-semibold" : "text-muted-foreground"
                  )}
                  style={{ color: isActive ? phaseColor : undefined }}
                >
                  {step.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Mobile Progress Bar */}
        <div className="mt-4 flex items-center gap-3 px-1">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: phaseColor }}
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((activeIndex + 1) / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span 
            className="text-xs font-medium"
            style={{ color: phaseColor }}
          >
            {activeIndex + 1}/{steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
