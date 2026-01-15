import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Agent avatar imports
import lumiAvatar from "@/assets/agents/lumi.png";
import noahAvatar from "@/assets/agents/noah.png";
import mayaAvatar from "@/assets/agents/maya.png";
import kaiAvatar from "@/assets/agents/kai.png";
import leoAvatar from "@/assets/agents/leo.png";
import emaAvatar from "@/assets/agents/ema.png";

const agentAvatars: Record<string, string> = {
  "Lumi": lumiAvatar,
  "Noah": noahAvatar,
  "Maya": mayaAvatar,
  "Kai": kaiAvatar,
  "Leo": leoAvatar,
  "Ema": emaAvatar,
};

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position?: "top" | "bottom" | "left" | "right" | "center";
  action?: ReactNode;
}

export interface AgentInfo {
  name: string;
  title?: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  storageKey?: string;
  agent?: AgentInfo | null;
}

export function OnboardingTour({
  steps,
  isOpen,
  onClose,
  onComplete,
  storageKey = "migrei-tour-completed",
  agent,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (!isOpen || !step?.target) {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll element into view
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isOpen, step?.target, currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem(storageKey, "true");
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, "true");
    onClose();
  };

  const getTooltipPosition = () => {
    const padding = 16;
    const tooltipWidth = Math.min(320, window.innerWidth - 32);
    const tooltipHeight = 240;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Center position for steps without target
    if (!targetRect || step?.position === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${tooltipWidth}px`,
        maxWidth: "calc(100vw - 32px)",
      };
    }

    let top: number;
    let left: number;

    // Check if target is in the sidebar (left side of screen, typically x < 280)
    const isInSidebar = targetRect.left < 280;

    switch (step?.position) {
      case "top":
        top = targetRect.top - tooltipHeight - padding;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.left - tooltipWidth - padding;
        break;
      case "right":
        // For sidebar items, align tooltip top with the item
        if (isInSidebar) {
          top = targetRect.top - 8;
          left = targetRect.right + padding;
        } else {
          top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
          left = targetRect.right + padding;
        }
        break;
      default:
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    }

    // Clamp to viewport boundaries
    left = Math.max(padding, Math.min(left, viewportWidth - tooltipWidth - padding));
    top = Math.max(padding, Math.min(top, viewportHeight - tooltipHeight - padding));

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      maxWidth: "calc(100vw - 32px)",
    };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Spotlight on target */}
        {targetRect && (
          <motion.div
            key={`spotlight-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 12px 2px hsl(var(--primary) / 0.4), 0 0 0 9999px rgba(0,0,0,0.6)",
              borderRadius: "10px",
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed z-[101] bg-card border border-border rounded-xl shadow-2xl p-4 sm:p-6"
          style={getTooltipPosition()}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Fechar tour"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Agent header */}
          {agent && (
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
              <img 
                src={agentAvatars[agent.name] || lumiAvatar} 
                alt={agent.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                {agent.title && (
                  <p className="text-xs text-muted-foreground">{agent.title}</p>
                )}
              </div>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentStep
                    ? "w-6 bg-primary"
                    : index < currentStep
                    ? "w-1.5 bg-primary/50"
                    : "w-1.5 bg-muted"
                )}
              />
            ))}
          </div>

          {/* Content */}
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
            {step?.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
            {step?.description}
          </p>

          {/* Action */}
          {step?.action && <div className="mb-4 sm:mb-6">{step.action}</div>}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3"
            >
              Pular
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              {!isFirstStep && (
                <Button variant="outline" size="sm" onClick={handlePrev} className="text-xs sm:text-sm px-2 sm:px-3">
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
              )}
              <Button size="sm" onClick={handleNext} className="text-xs sm:text-sm px-3 sm:px-4">
                {isLastStep ? (
                  <>
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
                    <span>Concluir</span>
                  </>
                ) : (
                  <>
                    <span>Próximo</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 sm:ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage tour state
export function useTour(storageKey: string = "migrei-tour-completed") {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    setHasCompleted(completed === "true");
    
    // Auto-open for new users after a short delay
    if (!completed) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const startTour = () => setIsOpen(true);
  const closeTour = () => setIsOpen(false);
  const completeTour = () => {
    setIsOpen(false);
    setHasCompleted(true);
  };
  const resetTour = () => {
    localStorage.removeItem(storageKey);
    setHasCompleted(false);
  };

  return {
    isOpen,
    hasCompleted,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  };
}
