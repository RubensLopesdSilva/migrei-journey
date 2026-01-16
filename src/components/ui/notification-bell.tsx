import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, X, Sparkles, Trophy, MessageCircle, Calendar, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const notificationIcons: Record<string, React.ElementType> = {
  achievement: Trophy,
  streak: Flame,
  community: MessageCircle,
  event: Calendar,
  system: Sparkles,
  default: Bell,
};

const notificationColors: Record<string, string> = {
  achievement: "text-amber-500 bg-amber-500/10",
  streak: "text-orange-500 bg-orange-500/10",
  community: "text-blue-500 bg-blue-500/10",
  event: "text-purple-500 bg-purple-500/10",
  system: "text-primary bg-primary/10",
  default: "text-muted-foreground bg-muted",
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-80">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Carregando...
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || notificationIcons.default;
                const colorClasses = notificationColors[notification.type] || notificationColors.default;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                      !notification.is_read && "bg-primary/5"
                    )}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                      colorClasses
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm truncate",
                          !notification.is_read ? "font-medium" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
