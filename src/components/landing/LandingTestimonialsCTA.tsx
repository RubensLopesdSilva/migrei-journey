import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Play, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const testimonials = [
  {
    quote: "Estava perdida depois de 15 anos na mesma empresa. O Migrei me ajudou a descobrir que minha experiência tinha valor em áreas que eu nem imaginava.",
    name: "Marina Santos",
    role: "De RH Corporativo para Consultora de Carreira",
    avatar: "M",
  },
  {
    quote: "Achava que precisava de uma faculdade nova. Na verdade, precisava de clareza. Em 3 meses já estava trabalhando na área que escolhi.",
    name: "Rafael Lima",
    role: "De Engenheiro para Product Manager",
    avatar: "R",
  },
  {
    quote: "A comunidade fez toda diferença. Saber que outras pessoas passavam pelo mesmo me deu coragem para seguir em frente.",
    name: "Carla Mendes",
    role: "De Advogada para UX Designer",
    avatar: "C",
  },
  {
    quote: "O plano de 90 dias foi um divisor de águas. Finalmente consegui organizar meus próximos passos de forma clara.",
    name: "João Pedro",
    role: "De Analista para Tech Lead",
    avatar: "J",
  },
];

export const LandingTestimonialsCTA = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 md:py-32 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que dizem sobre o Migrei
            </h2>
            <p className="text-slate-400 mb-8">
              Tudo o que você precisa para fazer sua transição de carreira acontecer — do autoconhecimento à ação.
            </p>

            {/* Quote */}
            <div className="relative mb-8">
              <Quote className="h-12 w-12 text-primary/30 mb-4" />
              <p className="text-lg text-slate-300 italic mb-6">
                "{testimonials[0].quote}"
              </p>
              <p className="text-white font-medium">_ {testimonials[0].name}</p>
            </div>

            {/* Avatar stack */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-primary/20 border-2 border-slate-900 flex items-center justify-center text-primary font-semibold text-sm"
                  >
                    {t.avatar}
                  </div>
                ))}
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
                <Play className="h-4 w-4 text-white ml-0.5" />
              </button>
            </div>
          </motion.div>

          {/* Right: CTA Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center mb-2">
                Comece sua jornada
              </h3>
              <p className="text-slate-400 text-center text-sm mb-6">
                Crie sua conta grátis e descubra seu próximo passo
              </p>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 group"
                  onClick={() => navigate("/auth?tab=signup")}
                >
                  Começar minha transição
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-center text-sm text-slate-500">
                  ou{" "}
                  <button
                    onClick={() => navigate("/auth?tab=login")}
                    className="text-primary hover:underline"
                  >
                    Fazer login
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
