import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Preciso saber para onde ir?",
    answer: "Não. O Migrei te ajuda justamente a descobrir isso. As primeiras fases são dedicadas ao autoconhecimento e exploração de possibilidades.",
  },
  {
    question: "Quanto tempo leva a transição?",
    answer: "Depende do seu ritmo e disponibilidade. Em média, nossos usuários levam de 3 a 6 meses para concluir todo o ciclo e iniciar a nova carreira.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim, ambos os planos podem ser cancelados a qualquer momento. No Essencial, você tem 7 dias para reembolso integral. No Premium, o cancelamento encerra a renovação, mas não há reembolso dos valores já pagos devido à mentoria especializada.",
  },
  {
    question: "As mentorias são ao vivo?",
    answer: "Sim. As mentorias do plano Premium são sessões individuais ao vivo (1:1) com especialistas certificados em transição de carreira.",
  },
  {
    question: "E se eu não gostar?",
    answer: "No plano Essencial, você tem 7 dias para testar e pedir reembolso integral. No plano Premium, você pode cancelar a renovação a qualquer momento, porém não há reembolso devido à mentoria especializada já agendada.",
  },
  {
    question: "Funciona para qualquer área?",
    answer: "Sim. Nossa metodologia é baseada em princípios universais de transição de carreira que funcionam independente da área de origem ou destino.",
  },
];

export const LandingFAQ = () => {
  return (
    <>
      <section id="faq" className="py-20 md:py-28 bg-gradient-to-b from-muted/20 to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Perguntas frequentes
            </h2>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <FinalCTA />
    </>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 via-background to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 md:mb-8">
            Pronto para a sua{" "}
            <span className="relative inline-block text-primary">
              transição
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden="true">
                <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>?
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/auth?tab=signup"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Começar grátis agora
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
