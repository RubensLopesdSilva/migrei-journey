import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const requirements: PasswordRequirement[] = useMemo(() => [
    { label: "Pelo menos 6 caracteres", met: password.length >= 6 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Uma letra minúscula", met: /[a-z]/.test(password) },
    { label: "Um número", met: /[0-9]/.test(password) },
    { label: "Um caractere especial", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ], [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length;
    if (metCount === 0) return { level: 0, label: "", color: "" };
    if (metCount <= 2) return { level: 1, label: "Fraca", color: "bg-destructive" };
    if (metCount <= 3) return { level: 2, label: "Média", color: "bg-yellow-500" };
    if (metCount <= 4) return { level: 3, label: "Forte", color: "bg-primary" };
    return { level: 4, label: "Muito forte", color: "bg-green-500" };
  }, [requirements]);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                strength.level >= level ? strength.color : "bg-muted"
              )}
            />
          ))}
        </div>
        {strength.label && (
          <p className={cn(
            "text-xs font-medium",
            strength.level <= 1 && "text-destructive",
            strength.level === 2 && "text-yellow-600",
            strength.level === 3 && "text-primary",
            strength.level === 4 && "text-green-600"
          )}>
            Força: {strength.label}
          </p>
        )}
      </div>

      {/* Requirements List */}
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              req.met ? "text-green-600" : "text-muted-foreground"
            )}
          >
            {req.met ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
