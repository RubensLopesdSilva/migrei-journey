import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoMigrei from "@/assets/logo-migrei.png";

export const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img src={logoMigrei} alt="Migrei" className="h-12 md:h-16" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Como funciona
            </button>
            <button
              onClick={() => scrollToSection("ciclo-migrei")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Método
            </button>
            <button
              onClick={() => scrollToSection("recursos")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Recursos
            </button>
            <button
              onClick={() => scrollToSection("planos")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth?tab=login")}>
              Entrar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth?tab=signup")}
            >
              Começar grátis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mt-4 pb-4 border-t border-border pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-left text-muted-foreground hover:text-foreground"
              >
                Como funciona
              </button>
              <button
                onClick={() => scrollToSection("ciclo-migrei")}
                className="text-left text-muted-foreground hover:text-foreground"
              >
                Método
              </button>
              <button
                onClick={() => scrollToSection("recursos")}
                className="text-left text-muted-foreground hover:text-foreground"
              >
                Recursos
              </button>
              <button
                onClick={() => scrollToSection("planos")}
                className="text-left text-muted-foreground hover:text-foreground"
              >
                Planos
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-muted-foreground hover:text-foreground"
              >
                FAQ
              </button>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" onClick={() => navigate("/auth?tab=login")}>
                  Entrar
                </Button>
                <Button onClick={() => navigate("/auth?tab=signup")}>
                  Começar grátis
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};
