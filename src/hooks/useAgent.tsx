import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AIAgent, AgentPersona, PERSONA_STYLES } from "@/types/agent";

interface AgentContextType {
  agents: AIAgent[];
  currentAgent: AIAgent | null;
  loading: boolean;
  hasSelectedAgent: boolean;
  selectAgent: (agentId: string) => Promise<void>;
  getAgentMessage: (type: 'greeting' | 'encouragement' | 'challenge') => string;
  refetch: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    const { data, error } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("Error fetching agents:", error);
      return;
    }

    setAgents(data || []);
  }, []);

  const fetchUserAgent = useCallback(async () => {
    if (!user) {
      setCurrentAgent(null);
      setLoading(false);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("agent_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user agent:", error);
      setLoading(false);
      return;
    }

    if (profile?.agent_id) {
      const agent = agents.find(a => a.id === profile.agent_id);
      setCurrentAgent(agent || null);
    } else {
      setCurrentAgent(null);
    }

    setLoading(false);
  }, [user, agents]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchAgents();
    // Also refetch user's selected agent
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("agent_id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (profile?.agent_id) {
        const agent = agents.find(a => a.id === profile.agent_id);
        setCurrentAgent(agent || null);
      }
    }
    setLoading(false);
  }, [fetchAgents, user, agents]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    if (!authLoading && agents.length > 0) {
      fetchUserAgent();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, agents, fetchUserAgent]);

  const selectAgent = async (agentId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ agent_id: agentId })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error selecting agent:", error);
      throw error;
    }

    const agent = agents.find(a => a.id === agentId);
    setCurrentAgent(agent || null);
  };

  const getAgentMessage = (type: 'greeting' | 'encouragement' | 'challenge') => {
    if (!currentAgent) {
      return PERSONA_STYLES.strategic[type]; // Default fallback
    }

    const persona = currentAgent.persona as AgentPersona;
    return PERSONA_STYLES[persona]?.[type] || PERSONA_STYLES.strategic[type];
  };

  const hasSelectedAgent = currentAgent !== null;

  return (
    <AgentContext.Provider value={{
      agents,
      currentAgent,
      loading,
      hasSelectedAgent,
      selectAgent,
      getAgentMessage,
      refetch
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
}
