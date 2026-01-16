import { motion } from "framer-motion";
import { 
  Brain, 
  Target, 
  Calendar, 
  Users, 
  Network, 
  MessageCircle,
  Bot,
  TrendingUp,
  Zap
} from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "Autoconhecimento em 15 min",
    description: "Diagnósticos validados que revelam seus talentos ocultos e padrões de carreira",
  },
  {
    icon: Target,
    title: "Missões práticas, não teoria",
    description: "Tarefas curtas que geram resultados reais a cada dia",
  },
  {
    icon: Calendar,
    title: "Plano de 90 dias na mão",
    description: "Roadmap personalizado com datas, metas e checkpoints claros",
  },
  {
    icon: Users,
    title: "Comunidade que entende você",
    description: "Conecte-se com pessoas no mesmo momento de transição",
  },
  {
    icon: Network,
    title: "Networking que funciona",
    description: "Conexões estratégicas guiadas, não networking genérico",
  },
  {
    icon: MessageCircle,
    title: "Mentores especialistas",
    description: "Sessões 1:1 com profissionais que já fizeram a transição",
  },
  {
    icon: Bot,
    title: "IA que te conhece",
    description: "Coach disponível 24/7 que aprende seu estilo e te cobra resultados",
  },
];

const painPoints = [
  {
    pain: "Passar meses sem saber o próximo passo",
    gain: "Ter clareza do caminho em 5 minutos",
  },
  {
    pain: "Consumir conteúdo sem aplicar nada",
    gain: "Completar missões práticas todo dia",
  },
  {
    pain: "Fazer networking sem direção",
    gain: "Conexões estratégicas que abrem portas",
  },
];

export const LandingBenefits = () => {
  return (
    <section id="beneficios" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que você ganha com o Migrei
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas práticas para sair da paralisia e entrar em ação
          </p>
        </motion.div>

        {/* Pain → Gain Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {painPoints.map((item, index) => (
            <motion.div
              key={index}
              className="relative p-6 rounded-xl bg-gradient-to-br from-destructive/5 to-primary/5 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Pain */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-destructive text-sm">✕</span>
                </div>
                <p className="text-muted-foreground text-sm line-through">{item.pain}</p>
              </div>
              
              {/* Arrow */}
              <div className="flex justify-center my-2">
                <TrendingUp className="h-5 w-5 text-primary rotate-45" />
              </div>
              
              {/* Gain */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-foreground font-medium text-sm">{item.gain}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all hover:shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
