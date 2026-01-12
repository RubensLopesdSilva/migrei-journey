import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Compass, 
  Target, 
  BookOpen, 
  Users, 
  Rocket, 
  Award,
  ChevronRight,
  Lock
} from "lucide-react";

interface RodaMigreiSectionProps {
  isPremium: boolean;
}

const stages = [
  {
    id: 1,
    name: "Autoconhecimento",
    description: "Descubra suas forças, valores e motivações para a transição",
    icon: Compass,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Exploração",
    description: "Explore novas áreas e identifique oportunidades alinhadas ao seu perfil",
    icon: Target,
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Capacitação",
    description: "Desenvolva as habilidades necessárias para sua nova carreira",
    icon: BookOpen,
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Networking",
    description: "Construa conexões estratégicas no seu novo mercado",
    icon: Users,
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "Ação",
    description: "Execute seu plano de transição com passos concretos",
    icon: Rocket,
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Consolidação",
    description: "Estabeleça-se na nova carreira e celebre sua conquista",
    icon: Award,
    color: "bg-yellow-500",
  },
];

export function RodaMigreiSection({ isPremium }: RodaMigreiSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Roda Migrei</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              As 6 etapas da metodologia para sua transição de carreira
            </p>
          </div>
          <Badge variant="secondary">Disponível para todos</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => (
            <Card
              key={stage.id}
              className="group hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary/30"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${stage.color} text-white shrink-0`}
                  >
                    <stage.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Etapa {stage.id}
                      </span>
                    </div>
                    <h4 className="font-semibold mt-1">{stage.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {stage.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 gap-2 group-hover:bg-primary/10"
                >
                  Acessar conteúdo
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isPremium && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border-2 border-dashed">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Quer acelerar sua transição?</p>
                <p className="text-sm text-muted-foreground">
                  Com o plano Premium você tem acesso a mentorias individuais com profissionais experientes.
                </p>
              </div>
              <Button>Fazer Upgrade</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
