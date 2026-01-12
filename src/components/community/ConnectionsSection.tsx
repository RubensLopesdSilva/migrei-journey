import { Check, X, UserPlus, Users } from 'lucide-react';
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
      {/* Pending connection requests */}
      {pendingConnections.length > 0 && (
        <Card className="card-elevated border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-5 w-5 text-primary" />
              Solicitações Pendentes
              <Badge variant="secondary">{pendingConnections.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingConnections.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={conn.user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conn.user?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{conn.user?.full_name}</p>
                    {conn.match_reason && (
                      <p className="text-sm text-muted-foreground">{conn.match_reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRespondToConnection(conn.id, false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onRespondToConnection(conn.id, true)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Match suggestions */}
      {matchSuggestions.length > 0 && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-xl">✨</span>
              Sugestões da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchSuggestions.map((match) => (
              <div 
                key={match.id} 
                className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={match.suggested_user?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {match.suggested_user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{match.suggested_user?.full_name}</p>
                      {match.suggested_user?.career_objective && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {match.suggested_user.career_objective}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {match.match_score}% match
                  </Badge>
                </div>

                {match.match_reasons.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Por que este match:</p>
                    <div className="flex flex-wrap gap-1">
                      {match.match_reasons.map((reason, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {match.suggested_user?.skills && match.suggested_user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {match.suggested_user.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {match.suggested_user.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{match.suggested_user.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onRespondToMatch(match.id, false)}
                  >
                    Ignorar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onRespondToMatch(match.id, true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active connections */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Minhas Conexões
            <Badge variant="secondary">{connections.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              Você ainda não tem conexões. Comece aceitando sugestões de match!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarImage src={conn.user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {conn.user?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-center text-sm">{conn.user?.full_name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
