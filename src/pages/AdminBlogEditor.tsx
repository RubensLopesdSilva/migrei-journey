import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import MDEditor from "@uiw/react-md-editor";
import {
  Save,
  Send,
  Clock,
  Eye,
  ArrowLeft,
  Image,
  Tag,
  FileText,
  Settings2,
  Loader2,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAdmin } from "@/hooks/useAdmin";
import {
  usePostBySlug,
  useAllPosts,
  useCategories,
  useCreatePost,
  useUpdatePost,
  generateSlug,
  calculateReadingTime,
} from "@/hooks/useBlog";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, BlogPostStatus, CreateBlogPostInput } from "@/types/blog";
import { cn } from "@/lib/utils";

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "novo";
  
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { data: categories } = useCategories();
  const { data: posts } = useAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  // Find existing post
  const existingPost = useMemo(() => {
    if (isNew || !posts) return null;
    return posts.find((p) => p.id === id);
  }, [posts, id, isNew]);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [contentFormat, setContentFormat] = useState<"markdown" | "html">("markdown");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState("09:00");

  // Load existing post data
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt || "");
      setContent(existingPost.content);
      setContentFormat(existingPost.content_format);
      setFeaturedImage(existingPost.featured_image || "");
      setCategoryId(existingPost.category_id || "");
      setTags(existingPost.tags || []);
      setMetaTitle(existingPost.meta_title || "");
      setMetaDescription(existingPost.meta_description || "");
      if (existingPost.scheduled_at) {
        const date = new Date(existingPost.scheduled_at);
        setScheduledAt(date);
        setScheduledTime(format(date, "HH:mm"));
      }
    }
  }, [existingPost]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, isNew, slug]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const buildPostData = (status: BlogPostStatus): CreateBlogPostInput => {
    let scheduled: string | undefined;
    if (status === "scheduled" && scheduledAt) {
      const [hours, minutes] = scheduledTime.split(":").map(Number);
      const date = new Date(scheduledAt);
      date.setHours(hours, minutes, 0, 0);
      scheduled = date.toISOString();
    }

    return {
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      content_format: contentFormat,
      featured_image: featuredImage || undefined,
      category_id: categoryId || undefined,
      tags,
      status,
      scheduled_at: scheduled,
      meta_title: metaTitle || undefined,
      meta_description: metaDescription || undefined,
    };
  };

  const handleSaveDraft = async () => {
    const data = buildPostData("draft");
    if (isNew) {
      await createPost.mutateAsync(data);
    } else {
      await updatePost.mutateAsync({ id: id!, ...data });
    }
    navigate("/admin/blog");
  };

  const handlePublish = async () => {
    const data = buildPostData("published");
    if (isNew) {
      await createPost.mutateAsync(data);
    } else {
      await updatePost.mutateAsync({ id: id!, ...data });
    }
    navigate("/admin/blog");
  };

  const handleSchedule = async () => {
    if (!scheduledAt) return;
    const data = buildPostData("scheduled");
    if (isNew) {
      await createPost.mutateAsync(data);
    } else {
      await updatePost.mutateAsync({ id: id!, ...data });
    }
    navigate("/admin/blog");
  };

  const isSaving = createPost.isPending || updatePost.isPending;
  const readingTime = calculateReadingTime(content);

  if (adminLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-[600px] rounded-xl" />
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  if (!isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6 pb-20">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Administração", href: "/admin" },
              { label: "Blog", href: "/admin/blog" },
              { label: isNew ? "Novo Artigo" : "Editar", current: true },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/blog")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isNew ? "Novo Artigo" : "Editar Artigo"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {readingTime} min de leitura estimado
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Settings Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Configurações do Artigo</SheetTitle>
                    <SheetDescription>
                      SEO, categoria e outras opções
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Adicionar tag"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleAddTag}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Featured Image */}
                    <div className="space-y-2">
                      <Label>Imagem Destacada (URL)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={featuredImage}
                          onChange={(e) => setFeaturedImage(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      {featuredImage && (
                        <img
                          src={featuredImage}
                          alt="Preview"
                          className="mt-2 w-full aspect-video object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* SEO */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold">SEO</h3>
                      <div className="space-y-2">
                        <Label>Meta Título</Label>
                        <Input
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                          placeholder={title}
                          maxLength={60}
                        />
                        <p className="text-xs text-muted-foreground">
                          {metaTitle.length}/60 caracteres
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Meta Descrição</Label>
                        <Textarea
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                          placeholder={excerpt}
                          maxLength={160}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          {metaDescription.length}/160 caracteres
                        </p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold">Agendamento</h3>
                      <div className="space-y-2">
                        <Label>Data de publicação</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              {scheduledAt
                                ? format(scheduledAt, "PPP", { locale: ptBR })
                                : "Selecionar data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={scheduledAt}
                              onSelect={setScheduledAt}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {scheduledAt && (
                        <div className="space-y-2">
                          <Label>Horário</Label>
                          <Input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                          />
                        </div>
                      )}
                      {scheduledAt && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleSchedule}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Clock className="h-4 w-4 mr-2" />
                          )}
                          Agendar publicação
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Save Draft */}
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={!title || !content || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar rascunho
              </Button>

              {/* Publish */}
              <Button
                onClick={handlePublish}
                disabled={!title || !content || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Publicar
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-4">
            {/* Title */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do artigo..."
              className="text-2xl font-bold h-auto py-3 border-none shadow-none focus-visible:ring-0 px-0"
            />

            {/* Slug */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>/blog/</span>
              <Input
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="h-8 w-auto max-w-xs font-mono text-sm"
              />
            </div>

            {/* Excerpt */}
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Resumo do artigo (aparece na listagem e SEO)..."
              rows={2}
              className="resize-none"
            />

            {/* Content Editor Tabs */}
            <Tabs
              value={contentFormat}
              onValueChange={(v) => setContentFormat(v as "markdown" | "html")}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <TabsContent value="markdown" className="mt-4">
                <div data-color-mode="light" className="[&_.w-md-editor]:border [&_.w-md-editor]:rounded-lg">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    height={500}
                    preview="live"
                    hideToolbar={false}
                  />
                </div>
              </TabsContent>
              <TabsContent value="html" className="mt-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h1>Seu conteúdo HTML aqui...</h1>"
                  rows={20}
                  className="font-mono text-sm"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
