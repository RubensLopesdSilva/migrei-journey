import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Briefcase, 
  FileText, 
  Linkedin, 
  Clock, 
  X, 
  Plus,
  Loader2,
  CheckCircle2
} from "lucide-react";

const mentorRegistrationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  title: z.string().min(5, "Título profissional deve ter pelo menos 5 caracteres"),
  bio: z.string().min(50, "Bio deve ter pelo menos 50 caracteres").max(500, "Bio deve ter no máximo 500 caracteres"),
  linkedin_url: z.string().url("URL inválida").optional().or(z.literal("")),
  years_experience: z.number().min(1, "Mínimo de 1 ano de experiência").max(50, "Máximo de 50 anos"),
  expertise: z.array(z.string()).min(1, "Adicione pelo menos uma área de expertise"),
});

type MentorRegistrationFormData = z.infer<typeof mentorRegistrationSchema>;

interface MentorRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MentorRegistrationModal({
  open,
  onOpenChange,
  onSuccess,
}: MentorRegistrationModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");

  const form = useForm<MentorRegistrationFormData>({
    resolver: zodResolver(mentorRegistrationSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      linkedin_url: "",
      years_experience: 1,
      expertise: [],
    },
  });

  const expertise = form.watch("expertise");

  const handleAddExpertise = () => {
    if (!expertiseInput.trim()) return;
    
    const currentExpertise = form.getValues("expertise");
    if (currentExpertise.length >= 5) {
      toast.error("Máximo de 5 áreas de expertise");
      return;
    }
    
    if (currentExpertise.includes(expertiseInput.trim())) {
      toast.error("Área já adicionada");
      return;
    }
    
    form.setValue("expertise", [...currentExpertise, expertiseInput.trim()]);
    setExpertiseInput("");
  };

  const handleRemoveExpertise = (item: string) => {
    const currentExpertise = form.getValues("expertise");
    form.setValue(
      "expertise",
      currentExpertise.filter((e) => e !== item)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExpertise();
    }
  };

  const onSubmit = async (data: MentorRegistrationFormData) => {
    if (!user) {
      toast.error("Você precisa estar logado para se cadastrar como mentor");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is already a mentor
      const { data: existingMentor } = await supabase
        .from("mentors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingMentor) {
        toast.error("Você já está cadastrado como mentor");
        setIsSubmitting(false);
        return;
      }

      // Create mentor profile
      const { error } = await supabase.from("mentors").insert({
        user_id: user.id,
        name: data.name,
        title: data.title,
        bio: data.bio,
        linkedin_url: data.linkedin_url || null,
        years_experience: data.years_experience,
        expertise: data.expertise,
        is_active: true,
      });

      if (error) {
        console.error("Error creating mentor:", error);
        toast.error("Erro ao cadastrar como mentor. Tente novamente.");
        return;
      }

      setIsSuccess(true);
      toast.success("Cadastro realizado com sucesso!");
      
      setTimeout(() => {
        onOpenChange(false);
        setIsSuccess(false);
        form.reset();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Cadastro Realizado!</h2>
            <p className="text-center text-muted-foreground">
              Seu perfil de mentor foi criado com sucesso. Agora configure sua
              disponibilidade para começar a receber agendamentos.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Cadastro de Mentor
          </DialogTitle>
          <DialogDescription>
            Preencha suas informações para se tornar um mentor na plataforma e
            ajudar outros profissionais em transição de carreira.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome Completo
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Título Profissional
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Product Manager | Ex-Engenheiro de Software"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva brevemente sua posição atual e trajetória
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Sobre Você
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte um pouco sobre sua experiência, transição de carreira, e como você pode ajudar outros profissionais..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 caracteres (mínimo 50)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Anos de Experiência */}
            <FormField
              control={form.control}
              name="years_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Anos de Experiência
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expertise */}
            <FormField
              control={form.control}
              name="expertise"
              render={() => (
                <FormItem>
                  <FormLabel>Áreas de Expertise</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ex: Transição de carreira, Liderança, Tech..."
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                    {expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {expertise.map((item) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="gap-1 pr-1"
                          >
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
                  <FormDescription>
                    Adicione até 5 áreas em que você pode mentorar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LinkedIn */}
            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/seu-perfil"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar como Mentor"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
