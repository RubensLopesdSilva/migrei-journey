import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const softSkills = [
  "Comunicação",
  "Liderança",
  "Empatia",
  "Resiliência",
  "Criatividade",
  "Adaptabilidade",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export function SkillsCard() {
  return (
    <motion.div 
      className="card-elevated p-3 sm:p-4 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <motion.div 
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-phase-descobrir/15 flex items-center justify-center"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-phase-descobrir" aria-hidden="true" />
        </motion.div>
        <h3 className="font-semibold text-xs sm:text-sm text-foreground">Soft Skills</h3>
      </div>

      <motion.div 
        className="flex flex-wrap gap-1 sm:gap-1.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {softSkills.map((skill) => (
          <motion.div
            key={skill}
            variants={badgeVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge 
              variant="secondary"
              className="rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-normal cursor-default"
            >
              {skill}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
