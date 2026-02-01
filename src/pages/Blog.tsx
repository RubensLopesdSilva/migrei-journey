import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, ArrowRight, Tag, Search } from "lucide-react";
import { usePublishedPosts, useCategories } from "@/hooks/useBlog";
import { SEOHead } from "@/components/seo/SEOHead";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import logoMigrei from "@/assets/logo-migrei.png";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: posts, isLoading: postsLoading } = usePublishedPosts(selectedCategory || undefined);
  const { data: categories } = useCategories();

  // Filter posts by search query
  const filteredPosts = posts?.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Structured data for SEO
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Migrei",
    "description": "Artigos sobre transição de carreira, desenvolvimento profissional e mercado de trabalho.",
    "url": "https://migrei.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Migrei",
      "logo": {
        "@type": "ImageObject",
        "url": "https://migrei.com/og-image.png"
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Blog | Migrei - Artigos sobre Transição de Carreira"
        description="Descubra dicas, estratégias e insights para sua transição de carreira. Artigos sobre desenvolvimento profissional, mercado de trabalho e crescimento pessoal."
        canonical="https://migrei.com/blog"
        structuredData={blogStructuredData}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoMigrei} alt="Migrei" className="h-10 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link to="/blog" className="text-sm font-medium text-foreground">
                Blog
              </Link>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Entrar
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Blog Migrei
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Insights e estratégias para sua jornada de transição de carreira
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                Todos
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <main className="container mx-auto px-4 py-12 md:py-16">
          {postsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={cn(
                    "group",
                    index === 0 && "md:col-span-2 lg:col-span-2"
                  )}
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    {/* Featured Image */}
                    {post.featured_image ? (
                      <div className={cn(
                        "relative overflow-hidden rounded-xl mb-4",
                        index === 0 ? "aspect-[2/1]" : "aspect-video"
                      )}>
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading={index < 3 ? "eager" : "lazy"}
                        />
                      </div>
                    ) : (
                      <div className={cn(
                        "bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl mb-4 flex items-center justify-center",
                        index === 0 ? "aspect-[2/1]" : "aspect-video"
                      )}>
                        <span className="text-4xl font-bold text-primary/30">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Category & Reading Time */}
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <Badge
                          variant="secondary"
                          style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
                        >
                          {post.category.name}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.reading_time_minutes} min de leitura
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className={cn(
                      "font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2",
                      index === 0 ? "text-2xl md:text-3xl" : "text-xl"
                    )}>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className={cn(
                        "text-muted-foreground mb-4 line-clamp-2",
                        index === 0 ? "text-base" : "text-sm"
                      )}>
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between">
                      <time className="text-xs text-muted-foreground">
                        {post.published_at && format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                      </time>
                      <span className="text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ler artigo
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-2">
                {searchQuery
                  ? "Nenhum artigo encontrado para sua busca."
                  : "Nenhum artigo publicado ainda."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline"
                >
                  Limpar busca
                </button>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t py-8 bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Migrei. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
