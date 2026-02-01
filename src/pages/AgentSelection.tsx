import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Loader2, Star, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgent } from "@/hooks/useAgent";
import { useToast } from "@/hooks/use-toast";
import { AIAgent } from "@/types/agent";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";

// Import agent avatar images
import lumiAvatar from "@/assets/agents/lumi.png";
import noahAvatar from "@/assets/agents/noah.png";
import emaAvatar from "@/assets/agents/ema.png";
import leoAvatar from "@/assets/agents/leo.png";
import mayaAvatar from "@/assets/agents/maya.png";
import kaiAvatar from "@/assets/agents/kai.png";

// Agent avatar images mapping
const agentAvatars: Record<string, string> = {
  'Lumi': lumiAvatar,
  'Noah': noahAvatar,
  'Ema': emaAvatar,
  'Leo': leoAvatar,
  'Maya': mayaAvatar,
  'Kai': kaiAvatar,
};

// Agent personality and approach descriptions
const agentPersonalities: Record<string, { approach: string; bestFor: string; style: string }> = {
  'Lumi': {
    approach: "Acolhe primeiro, desafia depois",
    bestFor: "Quem precisa de apoio emocional para agir",
    style: "Empático e motivador"
  },
  'Noah': {
    approach: "Direto ao ponto, foco em resultados",
    bestFor: "Quem quer eficiência e pragmatismo",
    style: "Analítico e objetivo"
  },
  'Ema': {
    approach: "Criativo e expansivo",
    bestFor: "Quem busca novas possibilidades",
    style: "Inspirador e visionário"
  },
  'Leo': {
    approach: "Coach que cobra resultados",
    bestFor: "Quem precisa de accountability",
    style: "Desafiador e energético"
  },
  'Maya': {
    approach: "Reflexivo e profundo",
    bestFor: "Quem valoriza autoconhecimento",
    style: "Introspectivo e sábio"
  },
  'Kai': {
    approach: "Prático e orientado a ação",
    bestFor: "Quem quer executar rápido",
    style: "Hands-on e estratégico"
  },
};

export default function AgentSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { agents, selectAgent, loading: agentsLoading, refetch } = useAgent();
  const { checkSubscription } = useSubscription();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle subscription success redirect
  useEffect(() => {
    const subscriptionStatus = searchParams.get("subscription");
    if (subscriptionStatus === "success") {
      // Refresh subscription status
      checkSubscription();
      toast({
        title: "🎉 Assinatura ativada!",
        description: "Agora escolha seu mentor IA para começar sua jornada.",
      });
      // Clean up URL
      window.history.replaceState({}, "", "/escolher-agente");
    }
  }, [searchParams, checkSubscription, toast]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const hoveredAgent = agents.find(a => a.id === hoveredAgentId);
  const displayAgent = hoveredAgent || selectedAgent;

  const handleConfirm = async () => {
    if (!selectedAgentId) return;

    setIsSubmitting(true);
    try {
      await selectAgent(selectedAgentId);
      // Refetch para garantir que o estado está atualizado antes de navegar
      await refetch();
      toast({
        title: `🎉 ${selectedAgent?.name} está pronto para te guiar!`,
        description: "Agora vamos começar seu diagnóstico de carreira.",
      });
      // Navega direto sem passar pelo ProtectedRoute verificar novamente
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Erro ao selecionar mentor",
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Preparando seus mentores...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Header - Clear purpose */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MessageCircle className="h-4 w-4" />
            Seu mentor te apoia em sua transição
          </motion.div>
          
          <motion.h1 
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Escolha o seu mentor
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Qual estilo combina com você?
          </motion.p>
        </motion.div>

        {/* Agents Grid - 3x2 layout */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 mb-4 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
              onConfirm={handleConfirm}
              isSubmitting={isSubmitting}
              index={index}
            />
          ))}
        </motion.div>


        {/* Empty state hint */}
        {!selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Star className="h-4 w-4" />
              Clique em um mentor para ver mais detalhes
            </p>
          </motion.div>
        )}

        {/* Helper text */}
        <motion.p 
          className="text-center text-muted-foreground/70 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Você pode trocar de mentor a qualquer momento nas Configurações
        </motion.p>
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

interface AgentCardProps {
  agent: AIAgent;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  index: number;
}

function AgentCard({ agent, isSelected, isHovered, onSelect, onHover, onLeave, onConfirm, isSubmitting, index }: AgentCardProps) {
  const avatarUrl = agentAvatars[agent.name] || lumiAvatar;
  const personality = agentPersonalities[agent.name];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className={cn(
        "group relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-300 overflow-hidden",
        isSelected 
          ? "border-primary bg-gradient-to-br from-primary/5 via-primary/10 to-transparent shadow-xl shadow-primary/15" 
          : "border-border/40 bg-card hover:border-primary/40 hover:shadow-lg"
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected indicator - top right */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute top-3 right-3 h-7 w-7 bg-primary rounded-full flex items-center justify-center shadow-lg z-10"
          >
            <Check className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar container */}
        <motion.div
          className="relative mb-3"
          animate={{ 
            scale: isSelected ? 1.08 : isHovered ? 1.04 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute -inset-1 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${agent.background_color}50, ${agent.background_color}20)`,
            }}
            animate={{
              opacity: isSelected ? 1 : isHovered ? 0.6 : 0,
              scale: isSelected ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Avatar */}
          <div 
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden ring-3 ring-white/60 dark:ring-gray-800/60 shadow-xl"
            style={{ backgroundColor: agent.background_color }}
          >
            <img 
              src={avatarUrl}
              alt={agent.name}
              className="w-[92%] h-[92%] object-cover rounded-full"
            />
          </div>
          
          {/* Pulse effect when selected */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ 
                border: `2px solid ${agent.background_color}`,
              }}
              animate={{ 
                scale: [1, 1.4, 1.4],
                opacity: [0.7, 0, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Info */}
        <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-0.5">
          {agent.name}
        </h3>
        <p className={cn(
          "text-sm font-medium transition-colors mb-2",
          isSelected ? "text-primary" : "text-muted-foreground"
        )}>
          {agent.title}
        </p>
        
        {/* Quick personality hint or Advance button */}
        <AnimatePresence mode="wait">
          {isSelected ? (
            <motion.div
              key="advance-button"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="sm"
                className="btn-primary-gradient gap-1.5 text-sm px-4"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Avançar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.p
              key="personality-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground/80 line-clamp-1"
            >
              {personality?.style || "Estilo adaptável"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
