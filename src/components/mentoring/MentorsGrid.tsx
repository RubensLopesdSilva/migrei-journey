import { motion } from "framer-motion";
import { Mentor } from "@/hooks/useMentoring";
import { MentorCard } from "./MentorCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, Search, Star, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MentorsGridProps {
  mentors: Mentor[];
  loading: boolean;
  canBookSessions: boolean;
  isFreePlan: boolean;
  remainingSessions: number;
  onSchedule: (mentor: Mentor) => void;
  onUpgrade: () => void;
}

export function MentorsGrid({
  mentors,
  loading,
  canBookSessions,
  isFreePlan,
  remainingSessions,
  onSchedule,
  onUpgrade,
}: MentorsGridProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Featured mentors for preview (show first 3)
  const featuredMentors = mentors.slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full mt-4" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-14" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Mentores Disponíveis
          </h2>
        </div>

        {/* Search - only for paid users */}
        {mentors.length > 0 && !isFreePlan && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mentor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>

      {/* Free plan - Elegant preview with featured mentors */}
      {isFreePlan ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Featured mentors preview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMentors.length > 0 ? (
              featuredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <Card className="h-full overflow-hidden border-primary/10 transition-all duration-300 group-hover:border-primary/30">
                    <CardContent className="p-6">
                      {/* Mentor header */}
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                          <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{mentor.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
                          {mentor.years_experience && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {mentor.years_experience} anos de experiência
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bio preview */}
                      {mentor.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {mentor.bio}
                        </p>
                      )}

                      {/* Expertise tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {mentor.expertise.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.expertise.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    {/* Elegant overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <Button 
                        onClick={onUpgrade}
                        size="sm"
                        className="gap-2 btn-primary-gradient shadow-lg"
                      >
                        <Sparkles className="h-4 w-4" />
                        Desbloquear
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              // Placeholder cards if no mentors yet
              [1, 2, 3].map((i) => (
                <Card key={i} className="h-64 opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-32 bg-muted rounded" />
                        <div className="h-4 w-24 bg-muted rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Bottom CTA section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-sm text-foreground">
                <span className="font-semibold">+{mentors.length > 3 ? mentors.length - 3 : 5}</span> mentores disponíveis
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
              Com o plano Premium, você tem 1 sessão de mentoria por mês com especialistas para acelerar sua transição.
            </p>
            <Button 
              onClick={onUpgrade} 
              size="lg"
              className="gap-2 btn-primary-gradient shadow-lg"
            >
              Fazer Upgrade para Premium
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      ) : mentors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhum mentor disponível</h3>
          <p className="text-muted-foreground">
            Volte em breve para ver novos mentores.
          </p>
        </motion.div>
      ) : filteredMentors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum resultado</h3>
          <p className="text-muted-foreground text-sm">
            Tente buscar por outro termo.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              isPremium={canBookSessions}
              onSchedule={onSchedule}
              disabled={!canBookSessions}
              disabledReason={
                remainingSessions === 0 
                  ? "Limite de sessões atingido"
                  : undefined
              }
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
