import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Compass, 
  Target, 
  BookOpen, 
  Users, 
  Rocket, 
  Award,
  ChevronRight,
  Lock
} from "lucide-react";

interface RodaMigreiSectionProps {
  isPremium: boolean;
}

const stages = [
  {
    id: 1,
    name: "Autoconhecimento",
    description: "Descubra suas forças, valores e motivações para a transição",
    icon: Compass,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Exploração",
    description: "Explore novas áreas e identifique oportunidades alinhadas ao seu perfil",
    icon: Target,
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Capacitação",
    description: "Desenvolva as habilidades necessárias para sua nova carreira",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Networking",
    description: "Construa conexões estratégicas no seu novo mercado",
    icon: Users,
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "Ação",
    description: "Execute seu plano de transição com passos concretos",
    icon: Rocket,
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Consolidação",
    description: "Estabeleça-se na nova carreira e celebre sua conquista",
    icon: Award,
    color: "bg-yellow-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

export function RodaMigreiSection({ isPremium }: RodaMigreiSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Roda Migrei</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              As 6 etapas da metodologia para sua transição de carreira
            </p>
          </div>
          <Badge variant="secondary">Disponível para todos</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02, 
                y: -4,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/30 h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <motion.div
                      className={`p-2 rounded-lg ${stage.color} text-white shrink-0`}
                      variants={iconVariants}
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      <stage.icon className="h-5 w-5" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Etapa {stage.id}
                        </span>
                      </div>
                      <h4 className="font-semibold mt-1">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 gap-2 group-hover:bg-primary/10 transition-colors"
                  >
                    Acessar conteúdo
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {!isPremium && (
          <motion.div 
            className="mt-6 p-4 bg-muted/50 rounded-lg border-2 border-dashed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-primary/10 rounded-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <Lock className="h-5 w-5 text-primary" />
              </motion.div>
              <div className="flex-1">
                <p className="font-medium">Quer acelerar sua transição?</p>
                <p className="text-sm text-muted-foreground">
                  Com o plano Premium você tem acesso a mentorias individuais com profissionais experientes.
                </p>
              </div>
              <Button className="btn-primary-gradient">Fazer Upgrade</Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
