import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

// Animation variants for reusable micro-interactions
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Hover and tap effects
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Card interaction animation
export const cardHover = {
  y: -4,
  boxShadow: "0 8px 24px -4px hsl(200 25% 15% / 0.16)",
  transition: { duration: 0.2 }
};

interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "fadeInUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight";
  delay?: number;
  className?: string;
}

const variantMap: Record<string, Variants> = {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideLeft: slideInFromLeft,
  slideRight: slideInFromRight
};

export function AnimatedContainer({ 
  children, 
  variant = "fadeInUp",
  delay = 0,
  className,
  ...props 
}: AnimatedContainerProps) {
  const selectedVariant = variantMap[variant];
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            ...(typeof selectedVariant.visible === 'object' && 'transition' in selectedVariant.visible 
              ? selectedVariant.visible.transition 
              : {}),
            delay
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
}

export function AnimatedList({ children, className, itemClassName }: AnimatedListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div 
          key={index} 
          variants={staggerItem}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function AnimatedCard({ 
  children, 
  className,
  interactive = true,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      whileHover={interactive ? cardHover : undefined}
      whileTap={interactive ? tapScale : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Progress animation for loading bars
interface AnimatedProgressProps {
  value: number;
  className?: string;
  color?: string;
}

export function AnimatedProgress({ value, className, color }: AnimatedProgressProps) {
  return (
    <div className={`h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color || "hsl(var(--primary))" }}
      />
    </div>
  );
}

// Number counter animation
interface AnimatedNumberProps {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedNumber({ value, className, suffix = "", prefix = "" }: AnimatedNumberProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={className}
    >
      {prefix}
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {value.toLocaleString()}
      </motion.span>
      {suffix}
    </motion.span>
  );
}
