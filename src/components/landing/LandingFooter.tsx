import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import logoMigrei from "@/assets/logo-migrei.png";

export const LandingFooter = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  return (
    <footer ref={ref} className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-xl p-4 inline-block mb-4">
              <img src={logoMigrei} alt="Migrei" className="h-8 brightness-0 invert" />
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Comece agora e experimente nossa plataforma
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl flex-1"
              />
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-xl h-10 w-10"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Informações da conta</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fale conosco</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Ajuda e Soluções</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Falar com suporte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status do sistema</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produto</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
              <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} Migrei. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Termos e Condições</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
});

LandingFooter.displayName = "LandingFooter";
