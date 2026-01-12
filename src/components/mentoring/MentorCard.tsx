import { Mentor } from "@/hooks/useMentoring";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Linkedin, Briefcase } from "lucide-react";

interface MentorCardProps {
  mentor: Mentor;
  isPremium: boolean;
  onSchedule: (mentor: Mentor) => void;
}

export function MentorCard({ mentor, isPremium, onSchedule }: MentorCardProps) {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg truncate">{mentor.name}</h3>
              {mentor.linkedin_url && (
                <a
                  href={mentor.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{mentor.title}</p>
            {mentor.years_experience > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Briefcase className="h-3 w-3" />
                <span>{mentor.years_experience} anos de experiência</span>
              </div>
            )}
          </div>
        </div>

        {mentor.bio && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
            {mentor.bio}
          </p>
        )}

        {mentor.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {mentor.expertise.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.expertise.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onSchedule(mentor)}
          disabled={!isPremium}
          className="w-full gap-2"
          variant={isPremium ? "default" : "outline"}
        >
          <Calendar className="h-4 w-4" />
          {isPremium ? "Agendar Mentoria" : "Premium Necessário"}
        </Button>
      </CardFooter>
    </Card>
  );
}
