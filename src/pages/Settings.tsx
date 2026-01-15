import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { User, Lock, Camera, Save, Loader2, CreditCard, Bot } from "lucide-react";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { SubscriptionCard } from "@/components/settings/SubscriptionCard";
import { AgentSettingsCard } from "@/components/settings/AgentSettingsCard";

const profileSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  bio: z.string().max(500).optional().or(z.literal("")),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
      setBio(data.bio || "");
    }
    setLoading(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setProfile((prev) => prev ? { ...prev, avatar_url: avatarUrl } : null);

      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar foto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      profileSchema.parse({ full_name: fullName, bio });
      setErrors({});
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio: bio || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      fetchProfile();
    }

    setSaving(false);
  };

  const handleChangePassword = async () => {
    try {
      passwordSchema.parse({ newPassword, confirmPassword });
      setErrors({});
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
      setNewPassword("");
      setConfirmPassword("");
    }

    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <PageLayout>
        <PageContent className="p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-10 w-64 bg-muted animate-pulse rounded" />
            <div className="h-12 w-full bg-muted animate-pulse rounded" />
            <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  const userInitials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() || "U";

  return (
    <PageLayout>
      <PageContent className="p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <PageBreadcrumb
              items={[{ label: "Configurações", current: true }]}
              className="mb-4"
            />
            
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Configurações
            </h1>

            <AnimatedTabs defaultValue="subscription" className="space-y-6">
              <AnimatedTabsList className="grid w-full grid-cols-4">
                <AnimatedTabsTrigger value="subscription" className="gap-2">
                  <CreditCard className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Assinatura</span>
                </AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="agent" className="gap-2">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Agente IA</span>
                </AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Perfil</span>
                </AnimatedTabsTrigger>
                <AnimatedTabsTrigger value="security" className="gap-2">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Segurança</span>
                </AnimatedTabsTrigger>
              </AnimatedTabsList>

              {/* Subscription Tab */}
              <AnimatedTabsContent value="subscription">
                <SubscriptionCard />
              </AnimatedTabsContent>

              {/* Agent Tab */}
              <AnimatedTabsContent value="agent">
                <AgentSettingsCard />
              </AnimatedTabsContent>

              {/* Profile Tab */}
              <AnimatedTabsContent value="profile" className="space-y-6">
                <div className="card-elevated p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    Foto de Perfil
                  </h2>

                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                        <AvatarImage src={profile?.avatar_url || ""} alt="Foto de perfil" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={handleAvatarClick}
                        disabled={uploadingAvatar}
                        aria-label="Alterar foto de perfil"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Camera className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        aria-label="Selecionar arquivo de imagem"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Alterar foto</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG ou GIF. Máximo 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-elevated p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Informações Pessoais
                  </h2>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        O email não pode ser alterado
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome completo</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Seu nome completo"
                      />
                      {errors.full_name && (
                        <p className="text-sm text-destructive">{errors.full_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Sobre você</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Conte um pouco sobre você..."
                        rows={4}
                      />
                      {errors.bio && (
                        <p className="text-sm text-destructive">{errors.bio}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary-gradient"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                    )}
                    Salvar alterações
                  </Button>
                </div>
              </AnimatedTabsContent>

              {/* Security Tab */}
              <AnimatedTabsContent value="security" className="space-y-6">
                <div className="card-elevated p-6 space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Alterar Senha
                  </h2>

                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      {errors.newPassword && (
                        <p className="text-sm text-destructive">{errors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={saving || !newPassword || !confirmPassword}
                    className="btn-primary-gradient"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                    ) : (
                      <Lock className="h-4 w-4 mr-2" aria-hidden="true" />
                    )}
                    Alterar senha
                  </Button>
                </div>
              </AnimatedTabsContent>
            </AnimatedTabs>
          </div>
      </PageContent>
    </PageLayout>
  );
}
