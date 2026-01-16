import { useState, useEffect, useMemo } from "react";
import { 
  Home, 
  Layers, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  UserCog,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useMentorStatus } from "@/hooks/useMentorStatus";
import { useProgress } from "@/hooks/useProgress";
import logoMigrei from "@/assets/logo-migrei.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Map phase numbers to URL slugs
const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isDynamic?: boolean; // Flag for items that need dynamic routing
}

const mainNavItems: NavItem[] = [
  {
    icon: Home,
    label: "Início",
    href: "/"
  },
  {
    icon: Layers,
    label: "Fase atual",
    href: "/fase", // Base path, will be dynamically replaced
    isDynamic: true
  },
  {
    icon: TrendingUp,
    label: "Progresso",
    href: "/progresso"
  },
  {
    icon: Users,
    label: "Comunidade",
    href: "/comunidade"
  },
  {
    icon: GraduationCap,
    label: "Mentoria",
    href: "/mentoria"
  }
];

const adminNavItems: NavItem[] = [
  {
    icon: UserCog,
    label: "Gerenciar Mentores",
    href: "/admin/mentores"
  },
  {
    icon: Users,
    label: "Gerenciar Usuários",
    href: "/admin/usuarios"
  },
  {
    icon: Settings,
    label: "Configurações",
    href: "/admin/configuracoes"
  }
];

const mentorNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Painel do Mentor",
    href: "/mentor"
  },
  {
    icon: CalendarDays,
    label: "Minhas Sessões",
    href: "/mentor/sessoes"
  }
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { isMentor } = useMentorStatus();
  const { currentPhase, userProgress } = useProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mentorMenuOpen, setMentorMenuOpen] = useState(false);

  // Calculate dynamic route for "Fase atual" based on user's current phase
  const currentPhaseRoute = useMemo(() => {
    const phaseNumber = userProgress?.current_phase_number || currentPhase?.phase_number || 1;
    const slug = phaseNumberToSlug[phaseNumber] || "despertar";
    return `/fase/${slug}`;
  }, [currentPhase, userProgress]);

  // Open admin menu if we're on an admin route
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setAdminMenuOpen(true);
    }
    if (location.pathname.startsWith("/mentor")) {
      setMentorMenuOpen(true);
    }
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo - stable, no re-render on navigation */}
      <div className="px-6 mb-8 flex justify-center">
        <Link to="/" className="flex items-center" onClick={closeMobile}>
          <img 
            alt="Migrei" 
            className="h-16 w-auto" 
            src="/lovable-uploads/a35459ed-c19c-44e1-a8af-803cf4d49f8d.png"
            loading="eager"
            decoding="sync"
          />
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {mainNavItems.map(item => {
            // Use dynamic route for "Fase atual" based on user's current phase
            const href = item.isDynamic ? currentPhaseRoute : item.href;
            
            // Check if current path matches - for phase routes, also check if we're on any /fase/ path
            const isActive = item.isDynamic 
              ? location.pathname.startsWith("/fase")
              : location.pathname === item.href;
            
            // Determine data-tour attribute based on original href
            const tourAttr = 
              item.href === "/fase" ? "sidebar-current-phase" :
              item.href === "/progresso" ? "sidebar-progress" :
              item.href === "/comunidade" ? "sidebar-community" :
              item.href === "/mentoria" ? "sidebar-mentoring" :
              undefined;
            
            return (
              <li key={item.label}>
                <Link 
                  to={href} 
                  onClick={closeMobile} 
                  className={cn("sidebar-item", isActive && "active")}
                  data-tour={tourAttr}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Admin Menu - Only visible for admins */}
        {isAdmin && (
          <div className="mt-6">
            <Collapsible open={adminMenuOpen} onOpenChange={setAdminMenuOpen}>
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "sidebar-item justify-between group",
                  location.pathname.startsWith("/admin") && "bg-primary/10"
                )}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">Administração</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Admin
                    </Badge>
                    {adminMenuOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-1 ml-4 pl-4 border-l border-sidebar-border space-y-1">
                  {adminNavItems.map(item => (
                    <li key={item.label}>
                      <Link 
                        to={item.href} 
                        onClick={closeMobile} 
                        className={cn(
                          "sidebar-item text-sm py-2",
                          location.pathname === item.href && "active"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Mentor Menu - Only visible for mentors */}
        {isMentor && (
          <div className="mt-6">
            <Collapsible open={mentorMenuOpen} onOpenChange={setMentorMenuOpen}>
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "sidebar-item justify-between group",
                  location.pathname.startsWith("/mentor") && "bg-primary/10"
                )}>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium">Mentor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      Mentor
                    </Badge>
                    {mentorMenuOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-1 ml-4 pl-4 border-l border-sidebar-border space-y-1">
                  {mentorNavItems.map(item => (
                    <li key={item.label}>
                      <Link 
                        to={item.href} 
                        onClick={closeMobile} 
                        className={cn(
                          "sidebar-item text-sm py-2",
                          location.pathname === item.href && "active"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </nav>

      {/* Footer Actions */}
      <div className="px-3 space-y-1">
        <Link 
          to="/configuracoes" 
          onClick={closeMobile} 
          className={cn("sidebar-item", location.pathname === "/configuracoes" && "active")}
          data-tour="sidebar-settings"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">Conta e assinatura</span>
        </Link>
        <button onClick={handleSignOut} className="sidebar-item w-full text-left hover:text-destructive">
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
            loading="eager"
            decoding="sync"
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
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMobile} />}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border flex flex-col py-6 z-50 transition-transform duration-300 md:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col py-6 z-50">
        <SidebarContent />
      </aside>
    </>
  );
}
