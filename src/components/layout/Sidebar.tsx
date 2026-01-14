import { useState } from "react";
import { 
  Home, 
  Layers, 
  TrendingUp, 
  Users, 
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logoMigrei from "@/assets/logo-migrei.png";
import { Button } from "@/components/ui/button";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 mb-8 flex justify-center">
        <Link to="/" className="flex items-center" onClick={closeMobile}>
          <img 
            src={logoMigrei} 
            alt="Migrei" 
            className="h-16 w-auto"
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
                onClick={closeMobile}
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
          onClick={closeMobile}
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
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 md:hidden z-50">
        <Link to="/" className="flex items-center">
          <img 
            src={logoMigrei} 
            alt="Migrei" 
            className="h-10 w-auto"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </Button>
      </div>

      {/* Mobile padding */}
      <div className="h-16 md:hidden" />

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border flex flex-col py-6 z-50 transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col py-6 z-50">
        <SidebarContent />
      </aside>
    </>
  );
}