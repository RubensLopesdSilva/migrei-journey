import { motion } from "framer-motion";
import { Mentor } from "@/hooks/useMentoring";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Linkedin, Briefcase, Lock, Star, MessageCircle } from "lucide-react";
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
        
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header with avatar and info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-background shadow-lg">
                <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
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
              
              {/* Stats row */}
              <div className="flex items-center gap-3 mt-2">
                {mentor.years_experience > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{mentor.years_experience}+ anos</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Star className="h-3 w-3 fill-current" />
                  <span>4.9</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  <span>24 sessões</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {mentor.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
              {mentor.bio}
            </p>
          )}

          {/* Expertise tags */}
          {mentor.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {mentor.expertise.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
              {mentor.expertise.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-0.5"
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
