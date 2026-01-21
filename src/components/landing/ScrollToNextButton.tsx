import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollToNextButtonProps {
  targetId: string;
}

export const ScrollToNextButton = ({ targetId }: ScrollToNextButtonProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      className="flex justify-center pt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={() => scrollToSection(targetId)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-muted-foreground/20 bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-colors"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Ir para próxima seção"
      >
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </motion.button>
    </motion.div>
  );
};
