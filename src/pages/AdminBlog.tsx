import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  FileText,
  Send,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdmin } from "@/hooks/useAdmin";
import { useAllPosts, useDeletePost } from "@/hooks/useBlog";
import type { BlogPost, BlogPostStatus } from "@/types/blog";

const statusConfig: Record<BlogPostStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  draft: { label: "Rascunho", variant: "secondary" },
  scheduled: { label: "Agendado", variant: "outline" },
  published: { label: "Publicado", variant: "default" },
};

export default function AdminBlog() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { data: posts, isLoading } = useAllPosts();
  const deletePost = useDeletePost();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Filter posts
  const filteredPosts = posts?.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.category?.name.toLowerCase().includes(query)
    );
  });

  const handleDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deletePost.mutate(postToDelete.id);
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (adminLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-96 rounded-xl" />
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
        <div className="space-y-6">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Administração", href: "/admin" },
              { label: "Blog", current: true },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Gerenciar Blog
              </h1>
              <p className="text-muted-foreground">
                Crie e gerencie artigos do blog
              </p>
            </div>
            <Button onClick={() => navigate("/admin/blog/novo")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Posts Table */}
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredPosts && filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-medium line-clamp-1">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          /blog/{post.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.category ? (
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: `${post.category.color}20`,
                              color: post.category.color,
                            }}
                          >
                            {post.category.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[post.status].variant}>
                          {post.status === "scheduled" && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {statusConfig[post.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {post.published_at
                          ? format(new Date(post.published_at), "dd/MM/yyyy", { locale: ptBR })
                          : post.scheduled_at
                          ? format(new Date(post.scheduled_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                          : format(new Date(post.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/admin/blog/${post.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            {post.status === "published" && (
                              <DropdownMenuItem asChild>
                                <Link to={`/blog/${post.slug}`} target="_blank">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(post)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="text-muted-foreground">
                        {searchQuery
                          ? "Nenhum artigo encontrado."
                          : "Nenhum artigo criado ainda."}
                      </div>
                      {!searchQuery && (
                        <Button
                          variant="link"
                          className="mt-2"
                          onClick={() => navigate("/admin/blog/novo")}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Criar primeiro artigo
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O artigo "{postToDelete?.title}" será
                removido permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageContent>
    </PageLayout>
  );
}
