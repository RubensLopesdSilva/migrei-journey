import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CelebrationModal, CelebrationType, triggerConfetti } from "./celebration";

interface CelebrationEvent {
  type: CelebrationType;
  title?: string;
  subtitle?: string;
  xp?: number;
  badgeName?: string;
}

interface CelebrationContextType {
  celebrate: (event: CelebrationEvent) => void;
  triggerConfetti: (type?: CelebrationType) => void;
}

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [currentCelebration, setCurrentCelebration] = useState<CelebrationEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom celebration events
  useEffect(() => {
    const handleCelebrationEvent = (event: CustomEvent<CelebrationEvent>) => {
      setCurrentCelebration(event.detail);
      setIsOpen(true);
    };

    window.addEventListener("migrei-celebration", handleCelebrationEvent as EventListener);
    return () => {
      window.removeEventListener("migrei-celebration", handleCelebrationEvent as EventListener);
    };
  }, []);

  const celebrate = useCallback((event: CelebrationEvent) => {
    // Dispatch custom event for consistency
    const customEvent = new CustomEvent("migrei-celebration", {
      detail: event
    });
    window.dispatchEvent(customEvent);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Clear celebration after animation
    setTimeout(() => setCurrentCelebration(null), 300);
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate, triggerConfetti }}>
      {children}
      {currentCelebration && (
        <CelebrationModal
          type={currentCelebration.type}
          isOpen={isOpen}
          onClose={handleClose}
          customTitle={currentCelebration.title}
          customSubtitle={currentCelebration.subtitle}
          xpEarned={currentCelebration.xp}
          badgeName={currentCelebration.badgeName}
        />
      )}
    </CelebrationContext.Provider>
  );
}

export function useCelebrationContext() {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error("useCelebrationContext must be used within CelebrationProvider");
  }
  return context;
}
