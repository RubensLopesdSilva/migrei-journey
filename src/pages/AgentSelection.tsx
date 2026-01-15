import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgent } from "@/hooks/useAgent";
import { useToast } from "@/hooks/use-toast";
import { AIAgent } from "@/types/agent";
import logoMigrei from "@/assets/logo-migrei.png";
import { cn } from "@/lib/utils";

// Agent avatar images mapping
const agentAvatars: Record<string, string> = {
  'Lumi': '/lovable-uploads/dfb4152f-5ee8-460f-b92f-b4276968713b.png',
  'Noah': '/lovable-uploads/a35459ed-c19c-44e1-a8af-803cf4d49f8d.png',
  'Ema': '/lovable-uploads/dfb4152f-5ee8-460f-b92f-b4276968713b.png',
  'Leo': '/lovable-uploads/a35459ed-c19c-44e1-a8af-803cf4d49f8d.png',
  'Maya': '/lovable-uploads/dfb4152f-5ee8-460f-b92f-b4276968713b.png',
  'Kai': '/lovable-uploads/a35459ed-c19c-44e1-a8af-803cf4d49f8d.png',
};

export default function AgentSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agents, selectAgent, loading: agentsLoading } = useAgent();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedAgentId) return;

    setIsSubmitting(true);
    try {
      await selectAgent(selectedAgentId);
      toast({
        title: "Agente escolhido!",
        description: "Seu tutor de IA está pronto para te acompanhar.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao selecionar agente",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (agentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={logoMigrei} 
            alt="Migrei" 
            className="h-16 w-auto mx-auto mb-6"
          />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Etapa final do cadastro</span>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Escolha quem vai te guiar nessa transição
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada agente tem um estilo de orientação único. Todos seguem o método Migrei.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {agents.map((agent, index) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentId === agent.id}
              isHovered={hoveredAgentId === agent.id}
              onSelect={() => setSelectedAgentId(agent.id)}
              onHover={() => setHoveredAgentId(agent.id)}
              onLeave={() => setHoveredAgentId(null)}
              index={index}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            size="lg"
            className="btn-primary-gradient px-8 py-6 text-lg gap-2"
            disabled={!selectedAgentId || isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Confirmar agente e iniciar minha jornada
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Helper text */}
        <p className="text-center text-muted-foreground text-sm mt-4">
          Você pode alterar seu agente a qualquer momento nas Configurações
        </p>
      </div>
    </div>
  );
}

interface AgentCardProps {
  agent: AIAgent;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  index: number;
}

function AgentCard({ agent, isSelected, isHovered, onSelect, onHover, onLeave, index }: AgentCardProps) {
  const avatarUrl = agentAvatars[agent.name] || '/lovable-uploads/dfb4152f-5ee8-460f-b92f-b4276968713b.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={cn(
        "relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300",
        isSelected 
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" 
          : "border-border/50 bg-card hover:border-primary/50 hover:shadow-md"
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Selected indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 h-8 w-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <Check className="h-5 w-5 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow effect when selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, ${agent.background_color}30 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar */}
        <motion.div
          className="relative mb-4"
          animate={{ 
            scale: isSelected ? 1.05 : isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: agent.background_color }}
          >
            <img 
              src={avatarUrl}
              alt={agent.name}
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>
          
          {/* Animated ring when selected */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(var(--primary), 0)',
                  '0 0 0 8px rgba(var(--primary), 0.1)',
                  '0 0 0 0 rgba(var(--primary), 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Info */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {agent.name}
        </h3>
        <p className="text-sm font-medium text-primary mb-2">
          {agent.title}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {agent.description}
        </p>
      </div>
    </motion.div>
  );
}
