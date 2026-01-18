import { Check, X, UserPlus, Users, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UserConnection, MatchSuggestion } from '@/types/community';

interface ConnectionsSectionProps {
  connections: UserConnection[];
  pendingConnections: UserConnection[];
  matchSuggestions: MatchSuggestion[];
  onRespondToConnection: (connectionId: string, accept: boolean) => void;
  onRespondToMatch: (matchId: string, connect: boolean) => void;
}

export function ConnectionsSection({
  connections,
  pendingConnections,
  matchSuggestions,
  onRespondToConnection,
  onRespondToMatch
}: ConnectionsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Pending connection requests - Compacto */}
      {pendingConnections.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-4 w-4 text-primary" />
              Solicitações
              <Badge variant="secondary" className="text-xs">{pendingConnections.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {pendingConnections.map((conn) => (
                <div 
                  key={conn.id} 
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={conn.user?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {conn.user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{conn.user?.full_name}</p>
                      {conn.match_reason && (
                        <p className="text-xs text-muted-foreground truncate">{conn.match_reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRespondToConnection(conn.id, false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onRespondToConnection(conn.id, true)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match suggestions - Design limpo */}
      {matchSuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Sugestões da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {matchSuggestions.map((match) => (
                <div 
                  key={match.id} 
                  className="p-3 rounded-xl border bg-card hover:shadow-sm transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={match.suggested_user?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {match.suggested_user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{match.suggested_user?.full_name}</p>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                          {match.match_score}%
                        </Badge>
                      </div>
                      {match.suggested_user?.career_objective && (
                        <p className="text-xs text-muted-foreground truncate">
                          {match.suggested_user.career_objective}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Skills - Compacto */}
                  {match.suggested_user?.skills && match.suggested_user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {match.suggested_user.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="text-[10px] font-normal px-1.5 py-0">
                          {skill}
                        </Badge>
                      ))}
                      {match.suggested_user.skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{match.suggested_user.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions - Simplificado */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 text-xs text-muted-foreground"
                      onClick={() => onRespondToMatch(match.id, false)}
                    >
                      Ignorar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => onRespondToMatch(match.id, true)}
                    >
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                      Conectar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active connections - Grid clean */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            Conexões
            <Badge variant="secondary" className="text-xs">{connections.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {connections.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Ainda sem conexões
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Aceite sugestões para começar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="flex flex-col items-center p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <Avatar className="h-12 w-12 mb-1.5 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    <AvatarImage src={conn.user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conn.user?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium text-center truncate w-full">
                    {conn.user?.full_name?.split(' ')[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}