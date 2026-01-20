import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Preciso saber para onde quero ir?",
    answer: "Não. O Migrei te ajuda justamente a descobrir isso. As primeiras fases são dedicadas ao autoconhecimento e exploração de possibilidades.",
  },
  {
    question: "Quanto tempo leva uma transição de carreira?",
    answer: "Depende do seu ritmo e disponibilidade. Em média, nossos usuários levam de 3 a 6 meses para concluir todo o ciclo e iniciar a nova carreira.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim. Não há fidelidade ou multa. Você pode cancelar sua assinatura a qualquer momento diretamente na plataforma.",
  },
  {
    question: "As mentorias são ao vivo?",
    answer: "Sim. As mentorias do plano Premium são sessões individuais ao vivo (1:1) com especialistas certificados em transição de carreira.",
  },
  {
    question: "E se eu não gostar?",
    answer: "Você tem 7 dias para testar qualquer plano pago e pedir reembolso integral se não ficar satisfeito. Sem perguntas.",
  },
  {
    question: "O Migrei funciona para qualquer área?",
    answer: "Sim. Nossa metodologia é baseada em princípios universais de transição de carreira que funcionam independente da área de origem ou destino.",
  },
];

export const LandingFAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dúvidas frequentes sobre transição de carreira
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
  );
};
