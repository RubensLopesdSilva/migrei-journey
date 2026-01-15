import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldX,
  Search,
  Loader2,
  X,
  UserPlus,
} from "lucide-react";

interface Mentor {
  id: string;
  user_id: string | null;
  name: string;
  title: string;
  bio: string | null;
  expertise: string[];
  avatar_url: string | null;
  linkedin_url: string | null;
  years_experience: number;
  is_active: boolean;
  created_at: string;
}

interface UserProfile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <PageContent>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Esta área é exclusiva para administradores do sistema.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </PageContent>
    </PageLayout>
  );
}

export default function AdminMentors() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    title: "",
    bio: "",
    linkedin_url: "",
    years_experience: 1,
    expertise: [] as string[],
    is_active: true,
  });
  const [expertiseInput, setExpertiseInput] = useState("");

  const fetchMentors = useCallback(async () => {
    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching mentors:", error);
      toast.error("Erro ao carregar mentores");
      return;
    }

    setMentors(data || []);
  }, []);

  const fetchUsers = useCallback(async () => {
    // Get users who are not already mentors
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url");

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    // Filter out users who are already mentors
    const mentorUserIds = mentors.map((m) => m.user_id);
    const availableUsers = (profiles || []).filter(
      (p) => !mentorUserIds.includes(p.user_id)
    );

    setUsers(availableUsers);
  }, [mentors]);

  useEffect(() => {
    if (isAdmin) {
      fetchMentors().finally(() => setLoading(false));
    }
  }, [isAdmin, fetchMentors]);

  useEffect(() => {
    if (mentors.length > 0) {
      fetchUsers();
    }
  }, [mentors, fetchUsers]);

  const resetForm = () => {
    setFormData({
      user_id: "",
      name: "",
      title: "",
      bio: "",
      linkedin_url: "",
      years_experience: 1,
      expertise: [],
      is_active: true,
    });
    setExpertiseInput("");
  };

  const handleAddExpertise = () => {
    if (!expertiseInput.trim()) return;
    if (formData.expertise.length >= 5) {
      toast.error("Máximo de 5 áreas");
      return;
    }
    if (formData.expertise.includes(expertiseInput.trim())) {
      toast.error("Área já adicionada");
      return;
    }
    setFormData({
      ...formData,
      expertise: [...formData.expertise, expertiseInput.trim()],
    });
    setExpertiseInput("");
  };

  const handleRemoveExpertise = (item: string) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((e) => e !== item),
    });
  };

  const handleUserSelect = (userId: string) => {
    const selectedUser = users.find((u) => u.user_id === userId);
    setFormData({
      ...formData,
      user_id: userId,
      name: selectedUser?.full_name || "",
    });
  };

  const handleCreateMentor = async () => {
    if (!formData.user_id || !formData.name || !formData.title) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("mentors").insert({
        user_id: formData.user_id,
        name: formData.name,
        title: formData.title,
        bio: formData.bio || null,
        linkedin_url: formData.linkedin_url || null,
        years_experience: formData.years_experience,
        expertise: formData.expertise,
        is_active: formData.is_active,
      });

      if (error) {
        console.error("Error creating mentor:", error);
        toast.error("Erro ao criar mentor");
        return;
      }

      toast.success("Mentor criado com sucesso!");
      setCreateModalOpen(false);
      resetForm();
      fetchMentors();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMentor = async () => {
    if (!selectedMentor) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("mentors")
        .update({
          name: formData.name,
          title: formData.title,
          bio: formData.bio || null,
          linkedin_url: formData.linkedin_url || null,
          years_experience: formData.years_experience,
          expertise: formData.expertise,
          is_active: formData.is_active,
        })
        .eq("id", selectedMentor.id);

      if (error) {
        console.error("Error updating mentor:", error);
        toast.error("Erro ao atualizar mentor");
        return;
      }

      toast.success("Mentor atualizado com sucesso!");
      setEditModalOpen(false);
      setSelectedMentor(null);
      resetForm();
      fetchMentors();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMentor = async () => {
    if (!selectedMentor) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("mentors")
        .delete()
        .eq("id", selectedMentor.id);

      if (error) {
        console.error("Error deleting mentor:", error);
        toast.error("Erro ao excluir mentor");
        return;
      }

      toast.success("Mentor excluído com sucesso!");
      setDeleteDialogOpen(false);
      setSelectedMentor(null);
      fetchMentors();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setFormData({
      user_id: mentor.user_id || "",
      name: mentor.name,
      title: mentor.title,
      bio: mentor.bio || "",
      linkedin_url: mentor.linkedin_url || "",
      years_experience: mentor.years_experience,
      expertise: mentor.expertise || [],
      is_active: mentor.is_active,
    });
    setEditModalOpen(true);
  };

  const openDeleteDialog = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setDeleteDialogOpen(true);
  };

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  // Not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Not an admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Administração", href: "/admin" },
              { label: "Mentores", current: true },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-primary" />
                Gerenciar Mentores
              </h1>
              <p className="text-muted-foreground mt-1">
                Adicione, edite ou remova mentores da plataforma
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setCreateModalOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Mentor
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mentores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mentors List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mentores ({filteredMentors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : filteredMentors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum mentor encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={mentor.avatar_url || undefined} />
                          <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{mentor.name}</p>
                            <Badge
                              variant={mentor.is_active ? "default" : "secondary"}
                            >
                              {mentor.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {mentor.title}
                          </p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {mentor.expertise.slice(0, 3).map((exp) => (
                              <Badge key={exp} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                            {mentor.expertise.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{mentor.expertise.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(mentor)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openDeleteDialog(mentor)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Adicionar Mentor
              </DialogTitle>
              <DialogDescription>
                Selecione um usuário e preencha as informações do mentor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* User Selection */}
              <div className="space-y-2">
                <Label>Usuário *</Label>
                <Select
                  value={formData.user_id}
                  onValueChange={handleUserSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.full_name || "Sem nome"} 
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome completo"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Título Profissional *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Product Manager | Ex-Engenheiro"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Sobre o mentor..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Years Experience */}
              <div className="space-y-2">
                <Label>Anos de Experiência</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.years_experience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      years_experience: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              {/* Expertise */}
              <div className="space-y-2">
                <Label>Áreas de Expertise</Label>
                <div className="flex gap-2">
                  <Input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="Adicionar área..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddExpertise();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddExpertise}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.expertise.map((item) => (
                      <Badge key={item} variant="secondary" className="gap-1 pr-1">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(item)}
                          className="ml-1 p-0.5 rounded-full hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <Label>Mentor Ativo</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateMentor} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Mentor"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Editar Mentor
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Título Profissional *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>

              {/* Years Experience */}
              <div className="space-y-2">
                <Label>Anos de Experiência</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.years_experience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      years_experience: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              {/* Expertise */}
              <div className="space-y-2">
                <Label>Áreas de Expertise</Label>
                <div className="flex gap-2">
                  <Input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="Adicionar área..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddExpertise();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddExpertise}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.expertise.map((item) => (
                      <Badge key={item} variant="secondary" className="gap-1 pr-1">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(item)}
                          className="ml-1 p-0.5 rounded-full hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <Label>Mentor Ativo</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditMentor} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Mentor</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o mentor{" "}
                <strong>{selectedMentor?.name}</strong>? Esta ação não pode ser
                desfeita e todas as sessões agendadas serão canceladas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMentor}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageContent>
    </PageLayout>
  );
}
