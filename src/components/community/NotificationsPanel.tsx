import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Check, CheckCheck, MessageCircle, UserPlus, Calendar, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { CommunityNotification } from '@/types/community';

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  match: Sparkles,
  comment: MessageCircle,
  connection: UserPlus,
  event: Calendar,
  help_request: HelpCircle,
  default: Bell
};

interface NotificationsPanelProps {
  notifications: CommunityNotification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationsPanel({ 
  notifications, 
  unreadCount, 
  onMarkRead, 
  onMarkAllRead 
}: NotificationsPanelProps) {
  return (
    <Card className="card-elevated">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notificações
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            Nenhuma notificação
          </p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.default;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                      notification.is_read 
                        ? "bg-transparent hover:bg-muted/50" 
                        : "bg-primary/5 hover:bg-primary/10"
                    )}
                    onClick={() => !notification.is_read && onMarkRead(notification.id)}
                  >
                    <div className={cn(
                      "p-2 rounded-full",
                      notification.is_read ? "bg-muted" : "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4",
                        notification.is_read ? "text-muted-foreground" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "font-medium text-sm",
                          notification.is_read && "text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
