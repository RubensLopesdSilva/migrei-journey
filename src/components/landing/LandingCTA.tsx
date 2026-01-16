import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, AlertCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Cost of inaction */}
          <motion.div
            className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AlertCircle className="h-4 w-4" />
            Cada mês de indecisão custa mais do que você imagina
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Em 5 minutos você terá{" "}
            <span className="text-primary">seu primeiro diagnóstico</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Descubra seus talentos ocultos, padrões de carreira e receba seu plano 
            de ação personalizado. Grátis e sem compromisso.
          </p>

          {/* What you get immediately */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Diagnóstico de carreira</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
              <span>Plano de 90 dias</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border/50 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>IA mentor pessoal</span>
            </div>
          </motion.div>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg group shadow-xl shadow-primary/20"
            onClick={() => navigate("/auth")}
          >
            Começar meu diagnóstico grátis
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Trust reinforcement */}
          <motion.p
            className="mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <strong>+2.000 profissionais</strong> já descobriram seu próximo passo. 
            Leva menos de 5 minutos.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
