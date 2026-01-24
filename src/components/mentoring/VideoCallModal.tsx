import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MessageSquare, 
  Phone,
  Loader2,
  AlertCircle,
  Users,
  Settings,
  Maximize2,
  Minimize2,
  Circle
} from "lucide-react";

// Generic session type that works for both MentoringSession and MentorSession
interface BaseSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  meeting_url: string | null;
  mentor?: { name: string; title?: string } | null;
  mentee?: { full_name: string | null } | null;
}

interface VideoCallModalProps {
  session: BaseSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DailyRoomResponse {
  room_url: string;
  token: string;
  is_owner: boolean;
}

export function VideoCallModal({ session, open, onOpenChange }: VideoCallModalProps) {
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState<DailyRoomResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  
  // Get participant name - works for both mentor and mentee views
  const participantName = session?.mentor?.name || session?.mentee?.full_name || "Participante";
  const participantTitle = session?.mentor?.title;

  const createOrJoinRoom = useCallback(async () => {
    if (!session) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      
      if (!authSession) {
        setError("Você precisa estar logado para entrar na sala");
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke("daily-room", {
        body: { session_id: session.id },
      });

      if (fnError) {
        console.error("Function error:", fnError);
        setError("Erro ao criar sala de vídeo. Tente novamente.");
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      setRoomData(data as DailyRoomResponse);
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (open && session && !roomData) {
      createOrJoinRoom();
    }
  }, [open, session, roomData, createOrJoinRoom]);

  useEffect(() => {
    if (!open) {
      setRoomData(null);
      setError(null);
    }
  }, [open]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLeaveCall = () => {
    onOpenChange(false);
    toast({
      title: "Chamada encerrada",
      description: "Você saiu da sessão de mentoria.",
    });
  };

  const roomUrlWithToken = roomData 
    ? `${roomData.room_url}?t=${roomData.token}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Circle className="h-3 w-3 fill-green-500 text-green-500 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-lg">
                  Sessão com {participantName}
                </DialogTitle>
                {participantTitle && (
                  <p className="text-sm text-muted-foreground">
                    {participantTitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {roomData?.is_owner && (
                <Badge variant="secondary" className="gap-1">
                  <Settings className="h-3 w-3" />
                  Host
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-black">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Preparando sua sala...</p>
                <p className="text-sm text-muted-foreground">
                  Isso pode levar alguns segundos
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <div className="text-center max-w-md">
                <p className="font-medium text-lg mb-2">Erro ao entrar na sala</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={createOrJoinRoom}>
                  Tentar novamente
                </Button>
              </div>
            </div>
          )}

          {roomUrlWithToken && !loading && !error && (
            <iframe
              ref={iframeRef}
              src={roomUrlWithToken}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; speaker; display-capture; compute-pressure"
              title="Video Call"
            />
          )}
        </div>

        {/* Bottom controls bar */}
        <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 px-4 py-2 bg-muted rounded-lg">
              <Video className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Vídeo</span>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 bg-muted rounded-lg">
              <Mic className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Áudio</span>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 bg-muted rounded-lg">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tela</span>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 bg-muted rounded-lg">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Chat</span>
            </div>
            
            <div className="w-px h-8 bg-border mx-2" />
            
            <Button
              variant="destructive"
              onClick={handleLeaveCall}
              className="gap-2"
            >
              <Phone className="h-4 w-4 rotate-[135deg]" />
              Sair da chamada
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            Use os controles dentro do vídeo para gerenciar câmera, microfone e compartilhamento de tela
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
