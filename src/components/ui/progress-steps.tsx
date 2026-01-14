import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export function ProgressSteps({
  steps,
  currentStep,
  className,
  orientation = "horizontal",
  size = "md"
}: ProgressStepsProps) {
  const sizeClasses = {
    sm: {
      circle: "h-6 w-6",
      icon: "h-3 w-3",
      text: "text-xs",
      gap: "gap-2"
    },
    md: {
      circle: "h-8 w-8",
      icon: "h-4 w-4",
      text: "text-sm",
      gap: "gap-3"
    },
    lg: {
      circle: "h-10 w-10",
      icon: "h-5 w-5",
      text: "text-base",
      gap: "gap-4"
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row items-center" : "flex-col",
        className
      )}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuenow={currentStep + 1}
      aria-valuetext={`Etapa ${currentStep + 1} de ${steps.length}: ${steps[currentStep]?.title}`}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className={cn(
              "flex",
              orientation === "horizontal" ? "flex-row items-center" : "flex-col items-start",
              !isLast && orientation === "horizontal" && "flex-1"
            )}
          >
            {/* Step indicator */}
            <div className={cn("flex items-center", sizes.gap)}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={cn(
                  "flex items-center justify-center rounded-full border-2 transition-all duration-300",
                  sizes.circle,
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "border-primary bg-primary/10",
                  !isCompleted && !isCurrent && "border-muted bg-muted/50"
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className={cn(sizes.icon, "text-primary-foreground")} />
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Circle className={cn(sizes.icon, "text-primary fill-primary")} />
                  </motion.div>
                ) : (
                  <span className={cn(sizes.text, "font-medium text-muted-foreground")}>
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step text */}
              {orientation === "horizontal" ? (
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      sizes.text,
                      "font-medium transition-colors",
                      isCompleted && "text-primary",
                      isCurrent && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              ) : (
                <div className="ml-3">
                  <p
                    className={cn(
                      sizes.text,
                      "font-medium transition-colors",
                      isCompleted && "text-primary",
                      isCurrent && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  "transition-all duration-500",
                  orientation === "horizontal"
                    ? "flex-1 h-0.5 mx-2 min-w-[20px]"
                    : "w-0.5 h-8 ml-4 my-2",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              >
                {isCompleted && (
                  <motion.div
                    initial={{ 
                      [orientation === "horizontal" ? "width" : "height"]: 0 
                    }}
                    animate={{ 
                      [orientation === "horizontal" ? "width" : "height"]: "100%" 
                    }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-primary h-full"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Compact version for mobile
interface MiniProgressStepsProps {
  current: number;
  total: number;
  className?: string;
}

export function MiniProgressSteps({ current, total, className }: MiniProgressStepsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index < current ? "w-6 bg-primary" : "w-1.5 bg-muted",
            index === current && "w-6 bg-primary/50"
          )}
        />
      ))}
      <span className="ml-2 text-xs text-muted-foreground">
        {current}/{total}
      </span>
    </div>
  );
}
