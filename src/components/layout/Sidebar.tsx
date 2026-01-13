import { 
  Home, 
  Layers, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logoMigrei from "@/assets/logo-migrei.png";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: "Início", href: "/" },
  { icon: Layers, label: "Fase", href: "/fase" },
  { icon: TrendingUp, label: "Progresso", href: "/progresso" },
  { icon: Users, label: "Comunidade", href: "/comunidade" },
  { icon: GraduationCap, label: "Mentoria", href: "/mentoria" },
];


export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col py-6 z-50">
      {/* Logo */}
      <div className="px-6 mb-8 flex justify-center">
        <Link to="/" className="flex items-center">
          <img 
            src={logoMigrei} 
            alt="Migrei" 
            className="h-14 w-auto"
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  "sidebar-item",
                  location.pathname === item.href && "active"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

      </nav>

      {/* Footer Actions */}
      <div className="px-3 space-y-1">
        <Link
          to="/configuracoes"
          className={cn(
            "sidebar-item",
            location.pathname === "/configuracoes" && "active"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Configurações</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="sidebar-item w-full text-left hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pt-4 border-t border-sidebar-border mt-4">
        <p className="text-xs text-muted-foreground">
          © 2025 Migrei
        </p>
      </div>
    </aside>
  );
}
