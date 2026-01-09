import { 
  Home, 
  Layers, 
  TrendingUp, 
  Users, 
  GraduationCap,
  CheckSquare,
  BookOpen,
  FolderKanban,
  Droplet
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Início", href: "/", active: true },
  { icon: Layers, label: "Fase", href: "/fase" },
  { icon: TrendingUp, label: "Progresso", href: "/progresso" },
  { icon: Users, label: "Comunidade", href: "/comunidade" },
  { icon: GraduationCap, label: "Mentoria", href: "/mentoria" },
];

const secondaryNavItems: NavItem[] = [
  { icon: CheckSquare, label: "Tarefas", href: "/tarefas" },
  { icon: BookOpen, label: "Conteúdo", href: "/conteudo" },
  { icon: FolderKanban, label: "Projetos", href: "/projetos" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col py-6 z-50">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2">
          <Droplet className="h-8 w-8 text-primary" />
          <h1 className="font-display text-2xl font-bold text-gradient-primary">
            Migrei
          </h1>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "sidebar-item",
                  item.active && "active"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="my-6 border-t border-sidebar-border" />

        {/* Secondary Navigation */}
        <ul className="space-y-1">
          {secondaryNavItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "sidebar-item",
                  item.active && "active"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 pt-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">
          © 2025 Migrei
        </p>
      </div>
    </aside>
  );
}
