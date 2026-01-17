import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Target, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "Diagnósticos Profissionais",
    description: "Ferramentas de autoconhecimento para identificar seus talentos, valores e padrões de carreira.",
    illustration: (
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 h-48 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20" />
            <div className="w-8 h-8 rounded-full bg-primary/30" />
            <div className="w-8 h-8 rounded-lg bg-primary/20" />
          </div>
          <div className="flex gap-2 ml-4">
            <div className="w-6 h-6 rounded-full bg-primary/40" />
            <div className="w-12 h-6 rounded bg-muted" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-3 rounded bg-muted" />
          <div className="w-20 h-3 rounded bg-primary/30" />
        </div>
      </div>
    ),
  },
  {
    icon: Target,
    title: "Plano de 90 Dias",
    description: "Metas SMART e cronograma personalizado para sua transição com acompanhamento passo a passo.",
    illustration: (
      <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl p-4 h-48 flex items-center justify-center">
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border/50 w-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-primary/20" />
            <div className="text-xs font-medium text-foreground">Plano de Ação</div>
          </div>
          <div className="text-lg font-bold text-primary mb-1">90 dias</div>
          <div className="text-xs text-muted-foreground">para sua transição</div>
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    title: "Comunidade & Mentoria",
    description: "Conecte-se com profissionais em transição e receba orientação de mentores especializados.",
    illustration: (
      <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-4 h-48 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background" />
            <div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-background" />
            <div className="w-8 h-8 rounded-full bg-primary/50 border-2 border-background" />
          </div>
          <div className="text-xs text-muted-foreground">+2k membros</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="w-24 h-2 rounded bg-muted" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-32 h-2 rounded bg-muted" />
          </div>
        </div>
      </div>
    ),
  },
];

export const LandingFeatures = () => {
  const navigate = useNavigate();

  return (
    <section id="recursos" className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Recursos para sua jornada
            </h2>
            <p className="text-muted-foreground">
              Ferramentas práticas que te ajudam a sair da dúvida e entrar em ação com clareza e confiança.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group"
              onClick={() => navigate("/auth")}
            >
              Começar agora
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="p-0 overflow-hidden bg-card border-border/50 hover:shadow-lg transition-all duration-300 h-full">
                {/* Illustration */}
                <div className="p-4">
                  {feature.illustration}
                </div>
                
                {/* Content */}
                <div className="p-6 pt-2">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
