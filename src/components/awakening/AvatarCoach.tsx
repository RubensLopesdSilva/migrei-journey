import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, Loader2, X, MessageCircle } from 'lucide-react';
import { useAvatarCoach } from '@/hooks/useAvatarCoach';
import { useAgent } from '@/hooks/useAgent';
import { cn } from '@/lib/utils';

// Import agent avatar images
import lumiAvatar from "@/assets/agents/lumi.png";
import noahAvatar from "@/assets/agents/noah.png";
import emaAvatar from "@/assets/agents/ema.png";
import leoAvatar from "@/assets/agents/leo.png";
import mayaAvatar from "@/assets/agents/maya.png";
import kaiAvatar from "@/assets/agents/kai.png";

const agentAvatars: Record<string, string> = {
  'Lumi': lumiAvatar,
  'Noah': noahAvatar,
  'Ema': emaAvatar,
  'Leo': leoAvatar,
  'Maya': mayaAvatar,
  'Kai': kaiAvatar,
};

interface AvatarCoachProps {
  phase?: string;
  context?: string;
  greeting?: string;
  minimized?: boolean;
  onToggle?: () => void;
}

export function AvatarCoach({ 
  phase = 'despertar', 
  context,
  greeting = "Olá! 👋 Sou sua Coach MIGREI. Estou aqui para te ajudar nessa jornada de descoberta profissional. Como você está se sentindo hoje em relação à sua carreira?",
  minimized = false,
  onToggle
}: AvatarCoachProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isStreaming, sendMessage, addGreeting } = useAvatarCoach({ phase, context });
  const { currentAgent, hasSelectedAgent } = useAgent();
  
  const avatarUrl = currentAgent ? agentAvatars[currentAgent.name] || lumiAvatar : lumiAvatar;
  const agentName = currentAgent?.name || 'Coach MIGREI';
  const agentTitle = currentAgent?.title || 'Sua mentora de carreira';

  useEffect(() => {
    addGreeting(greeting);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (minimized) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform z-50 p-0 overflow-hidden"
      >
        {hasSelectedAgent ? (
          <img src={avatarUrl} alt={agentName} className="h-full w-full object-cover" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    );
  }

  return (
    <Card className="flex flex-col h-[500px] bg-card border-border shadow-xl">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-full ring-2 ring-primary/20 overflow-hidden flex-shrink-0"
              style={{ backgroundColor: currentAgent?.background_color || 'hsl(var(--primary))' }}
            >
              {hasSelectedAgent ? (
                <img src={avatarUrl} alt={agentName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/60">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-base">{agentName}</CardTitle>
              <p className="text-xs text-muted-foreground">{agentTitle}</p>
            </div>
          </div>
          {onToggle && (
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div 
                    className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: currentAgent?.background_color || 'hsl(var(--primary) / 0.1)' }}
                  >
                    {hasSelectedAgent ? (
                      <img src={avatarUrl} alt={agentName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3 justify-start">
                <div 
                  className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: currentAgent?.background_color || 'hsl(var(--primary) / 0.1)' }}
                >
                  {hasSelectedAgent ? (
                    <img src={avatarUrl} alt={agentName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="min-h-[44px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[44px] w-[44px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
