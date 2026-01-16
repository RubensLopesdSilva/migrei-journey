import { motion } from "framer-motion";
import { Mentor } from "@/hooks/useMentoring";
import { MentorCard } from "./MentorCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Lock, Sparkles, Search } from "lucide-react";
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

        {/* Search */}
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

      {/* Free plan overlay */}
      {isFreePlan ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Blurred preview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 blur-sm pointer-events-none select-none">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-72">
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
            ))}
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-md p-8"
            >
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Acesso Exclusivo</h3>
              <p className="text-muted-foreground mb-6">
                Faça upgrade para acessar mentorias individuais com profissionais 
                que já passaram pela transição de carreira.
              </p>
              <Button 
                onClick={onUpgrade} 
                size="lg"
                className="gap-2 btn-primary-gradient shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
                Desbloquear Mentorias
              </Button>
            </motion.div>
          </div>
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
