import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, ArrowLeft, Tag, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { usePostBySlug, usePublishedPosts } from "@/hooks/useBlog";
import { SEOHead } from "@/components/seo/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import logoMigrei from "@/assets/logo-migrei.png";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePostBySlug(slug || "");
  const { data: relatedPosts } = usePublishedPosts();

  // Get related posts (same category, excluding current)
  const related = relatedPosts
    ?.filter(p => p.id !== post?.id && p.category_id === post?.category_id)
    .slice(0, 3);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = post?.title || "";

  const handleShare = (platform: "twitter" | "linkedin" | "facebook") => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  // Structured data for article
  const articleStructuredData = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.meta_title || post.title,
        "description": post.meta_description || post.excerpt,
        "image": post.featured_image || "https://migrei.com/og-image.png",
        "datePublished": post.published_at,
        "dateModified": post.updated_at,
        "author": {
          "@type": "Organization",
          "name": "Migrei"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Migrei",
          "logo": {
            "@type": "ImageObject",
            "url": "https://migrei.com/og-image.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://migrei.com/blog/${post.slug}`
        }
      }
    : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="aspect-video w-full rounded-xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O artigo que você procura não existe ou foi removido.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `Leia "${post.title}" no Blog Migrei`}
        canonical={`https://migrei.com/blog/${post.slug}`}
        ogImage={post.featured_image || undefined}
        ogType="article"
        structuredData={articleStructuredData}
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

        {/* Article */}
        <article className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Badge
                variant="secondary"
                style={{ backgroundColor: `${post.category.color}20`, color: post.category.color }}
              >
                {post.category.name}
              </Badge>
            )}
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {post.reading_time_minutes} min de leitura
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Date & Share */}
          <div className="flex items-center justify-between mb-8">
            <time className="text-sm text-muted-foreground">
              Publicado em {post.published_at && format(new Date(post.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </time>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                <Share2 className="h-4 w-4 inline mr-1" />
                Compartilhar
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <figure className="mb-10">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-xl"
              />
            </figure>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-pre:bg-muted"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10">
              <Separator className="mb-6" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground mr-2">Tags:</span>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {related && related.length > 0 && (
          <section className="border-t bg-muted/20 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">
                Artigos relacionados
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {related.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    {relatedPost.featured_image ? (
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="aspect-video w-full object-cover rounded-lg mb-3"
                      />
                    ) : (
                      <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground/30">
                          {relatedPost.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t py-8 bg-background">
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
