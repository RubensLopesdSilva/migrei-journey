import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Página não encontrada | Migrei"
        description="A página que você está procurando não existe ou foi movida. Volte para a página inicial do Migrei."
        noIndex={true}
      />
      
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-muted/50 to-background p-6">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Number */}
          <motion.div 
            className="text-8xl md:text-9xl font-bold text-primary/20 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            404
          </motion.div>
          
          {/* Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            A página <code className="bg-muted px-2 py-1 rounded text-sm">{location.pathname}</code> não existe ou foi movida.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Ir para o início
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/landing">
                <Search className="h-4 w-4" />
                Ver a plataforma
              </Link>
            </Button>
          </div>
          
          {/* Back button */}
          <button 
            onClick={() => window.history.back()}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar para a página anterior
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
