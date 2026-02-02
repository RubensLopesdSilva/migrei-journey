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

  const fetchAgents = useCallback(async (): Promise<AIAgent[]> => {
    const { data, error } = await supabase
      .from("ai_agents")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("Error fetching agents:", error);
      return [];
    }

    const fetchedAgents = data || [];
    setAgents(fetchedAgents);
    return fetchedAgents;
  }, []);

  const fetchUserAgent = useCallback(async (agentsList: AIAgent[]) => {
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
      const agent = agentsList.find(a => a.id === profile.agent_id);
      setCurrentAgent(agent || null);
    } else {
      setCurrentAgent(null);
    }

    setLoading(false);
  }, [user]);

  // Core refetch function that fetches everything fresh from the database
  const refetch = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch agents first and get the result directly
      const freshAgents = await fetchAgents();
      
      // Fetch user's agent using the FRESH agents list from DB
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("agent_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && profile?.agent_id) {
        // Use the freshly fetched agents, NOT the stale state
        const agent = freshAgents.find(a => a.id === profile.agent_id);
        setCurrentAgent(agent || null);
      } else {
        setCurrentAgent(null);
      }
    } catch (err) {
      console.error("Error in refetch:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchAgents, user]);

  // Initial load - CRITICAL: Only run after auth is done loading
  useEffect(() => {
    const init = async () => {
      // Wait for auth to finish loading before making any decisions
      if (authLoading) {
        return;
      }
      
      const fetchedAgents = await fetchAgents();
      if (user) {
        await fetchUserAgent(fetchedAgents);
      } else {
        setCurrentAgent(null);
        setLoading(false);
      }
    };
    init();
  }, [authLoading, user, fetchAgents, fetchUserAgent]);

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

    // Immediately update current agent from existing agents list
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
