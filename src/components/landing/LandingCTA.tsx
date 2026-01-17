import { motion } from "framer-motion";
import { Target, Bot, Users, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: Target,
    title: "Método em 6 fases",
    description: "Jornada estruturada e progressiva",
    color: "bg-rose-100",
    iconColor: "text-rose-500",
  },
  {
    icon: Bot,
    title: "IA personalizada",
    description: "Assistente que entende seu momento",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Users,
    title: "Networking prático",
    description: "Conexões que abrem portas",
    color: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    icon: GraduationCap,
    title: "Mentores disponíveis",
    description: "Orientação de quem já passou por isso",
    color: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
];

export const LandingCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Incluído na plataforma
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-slate-900 mb-12 md:mb-16"
        >
          O que você recebe
        </motion.h2>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              {/* Checkmark */}
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                <benefit.icon className={`h-7 w-7 ${benefit.iconColor}`} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Começar agora — é grátis
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
