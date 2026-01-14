import { Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";

interface Connection {
  id: string;
  name: string;
  role: string;
  initials: string;
}

const recentConnections: Connection[] = [
  { id: "1", name: "Ana Silva", role: "Product Manager", initials: "AS" },
  { id: "2", name: "Carlos O.", role: "Tech Lead", initials: "CO" },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export function NetworkingCard() {
  return (
    <motion.div 
      className="card-elevated p-3 sm:p-4 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <motion.div 
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-phase-deslanchar/15 flex items-center justify-center"
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-phase-deslanchar" aria-hidden="true" />
          </motion.div>
          <h3 className="font-semibold text-xs sm:text-sm text-foreground">Networking</h3>
        </div>
        <Link 
          to="/comunidade" 
          className={cn(
            "text-primary hover:text-primary/80 transition-colors p-1.5 -m-1.5 rounded-lg",
            focusRingClasses
          )}
          aria-label="Ver comunidade"
        >
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      <motion.div 
        className="space-y-1.5 sm:space-y-2 flex-1"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {recentConnections.map((connection) => (
          <motion.div 
            key={connection.id}
            variants={itemVariants}
            whileHover={{ x: 4, backgroundColor: "hsl(var(--muted))" }}
            className={cn(
              "flex items-center gap-2 p-1.5 rounded-lg transition-colors cursor-pointer",
              focusRingClasses
            )}
            tabIndex={0}
            role="button"
            aria-label={`Ver perfil de ${connection.name}`}
          >
            <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-xs">
                {connection.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-foreground truncate">
                {connection.name}
              </p>
              <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate">
                {connection.role}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link 
          to="/comunidade"
          className={cn(
            "mt-2 sm:mt-3 w-full btn-primary-gradient text-[10px] sm:text-xs py-1.5 sm:py-2 text-center block",
            focusRingClasses
          )}
        >
          Ver conexões
        </Link>
      </motion.div>
    </motion.div>
  );
}
