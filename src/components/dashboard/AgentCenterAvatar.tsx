import { motion } from "framer-motion";
import { useAgent } from "@/hooks/useAgent";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

// Import agent avatar images
import agentsSet1 from "@/assets/agents/agents-set-1.png";
import agentsSet2 from "@/assets/agents/agents-set-2.png";
import agentsSet3 from "@/assets/agents/agents-set-3.png";
import agentsSet4 from "@/assets/agents/agents-set-4.png";

interface AgentCenterAvatarProps {
  size?: number;
  showTooltip?: boolean;
}

// Agent avatar images mapping
const agentAvatars: Record<string, string> = {
  'Lumi': agentsSet1,
  'Noah': agentsSet2,
  'Ema': agentsSet3,
  'Leo': agentsSet4,
  'Maya': agentsSet1,
  'Kai': agentsSet2,
};

export function AgentCenterAvatar({ size = 56, showTooltip = true }: AgentCenterAvatarProps) {
  const { currentAgent, getAgentMessage, loading, hasSelectedAgent } = useAgent();

  // Show loading or fallback
  if (loading || !hasSelectedAgent) {
    return (
      <motion.div 
        className="rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center"
        style={{ width: size, height: size }}
        animate={{ 
          borderColor: ['hsl(var(--primary) / 0.2)', 'hsl(var(--primary) / 0.35)', 'hsl(var(--primary) / 0.2)']
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <User className="text-primary" style={{ width: size * 0.4, height: size * 0.4 }} />
      </motion.div>
    );
  }

  const avatarUrl = agentAvatars[currentAgent?.name || ''] || agentsSet1;

  return (
    <div className="relative group">
      <motion.div 
        className="rounded-full overflow-hidden flex items-center justify-center relative"
        style={{ 
          width: size, 
          height: size,
          backgroundColor: currentAgent?.background_color || '#BBF7D0'
        }}
        animate={{ 
          boxShadow: [
            `0 0 0 0 ${currentAgent?.background_color}00`,
            `0 0 0 6px ${currentAgent?.background_color}40`,
            `0 0 0 0 ${currentAgent?.background_color}00`
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Avatar image */}
        <img 
          src={avatarUrl}
          alt={currentAgent?.name}
          className="w-[85%] h-[85%] object-cover rounded-full"
        />
        
        {/* Subtle glow overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)`
          }}
        />
      </motion.div>

      {/* Tooltip on hover */}
      {showTooltip && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg px-3 py-2 shadow-lg z-30 pointer-events-none whitespace-nowrap"
          style={{ top: size + 8 }}
          initial={{ opacity: 0, y: -4 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <p className="text-xs font-medium text-foreground">{currentAgent?.name}</p>
          <p className="text-xs text-muted-foreground">{getAgentMessage('greeting')}</p>
        </motion.div>
      )}
    </div>
  );
}
