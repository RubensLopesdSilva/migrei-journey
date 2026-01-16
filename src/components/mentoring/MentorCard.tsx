import { motion } from "framer-motion";
import { Mentor } from "@/hooks/useMentoring";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Linkedin, Briefcase, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MentorCardProps {
  mentor: Mentor;
  isPremium: boolean;
  onSchedule: (mentor: Mentor) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function MentorCard({ 
  mentor, 
  isPremium, 
  onSchedule, 
  disabled = false,
  disabledReason 
}: MentorCardProps) {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isDisabled = disabled || !isPremium;
  const buttonText = isDisabled
    ? disabledReason || "Premium Necessário"
    : "Agendar Sessão";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <CardContent className="p-5 flex flex-col h-full">
          {/* Header with avatar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative shrink-0">
              <Avatar className="h-14 w-14 ring-2 ring-background shadow-md">
                <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-foreground truncate">
                  {mentor.name}
                </h3>
                {mentor.linkedin_url && (
                  <a
                    href={mentor.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
            </div>
          </div>

          {/* Experience badge */}
          {mentor.years_experience > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <Briefcase className="h-4 w-4 text-primary/70" />
              <span>{mentor.years_experience}+ anos de experiência</span>
            </div>
          )}

          {/* Bio */}
          {mentor.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {mentor.bio}
            </p>
          )}

          {/* Expertise tags */}
          {mentor.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
              {mentor.expertise.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs font-normal px-2.5 py-1 bg-muted/80"
                >
                  {skill}
                </Badge>
              ))}
              {mentor.expertise.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs font-normal px-2.5 py-1"
                >
                  +{mentor.expertise.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action button */}
          <div className="mt-auto">
            {isDisabled && disabledReason ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Button
                      disabled
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <Lock className="h-4 w-4" />
                      {buttonText}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{disabledReason}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                onClick={() => onSchedule(mentor)}
                disabled={isDisabled}
                className={`w-full gap-2 transition-all ${
                  isPremium && !disabled 
                    ? "btn-primary-gradient shadow-lg shadow-primary/25 hover:shadow-primary/40" 
                    : ""
                }`}
                variant={isPremium && !disabled ? "default" : "outline"}
              >
                {isDisabled ? <Lock className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                {buttonText}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
