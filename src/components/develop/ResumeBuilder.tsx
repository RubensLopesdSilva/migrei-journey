import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { FileText, Plus, Trash2, Save, Download, Copy } from 'lucide-react';
import type { UserResume } from '@/types/develop';

interface ResumeBuilderProps {
  resumes: UserResume[];
  onCreateResume: (data: Partial<UserResume>) => Promise<any>;
  onUpdateResume: (id: string, data: Partial<UserResume>) => Promise<boolean>;
  onDeleteResume: (id: string) => Promise<boolean>;
  onComplete?: () => void;
}

export function ResumeBuilder({ 
  resumes, 
  onCreateResume, 
  onUpdateResume, 
  onDeleteResume,
  onComplete 
}: ResumeBuilderProps) {
  const [selectedResume, setSelectedResume] = useState<UserResume | null>(resumes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserResume>>({});

  const handleCreateNew = async () => {
    const newResume = await onCreateResume({
      version_name: `Currículo ${resumes.length + 1}`,
      personal_info: {},
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      certifications: []
    });
    if (newResume) {
      setSelectedResume(newResume as UserResume);
      setIsEditing(true);
      setFormData(newResume);
    }
  };

  const handleSave = async () => {
    if (!selectedResume) return;
    const success = await onUpdateResume(selectedResume.id, formData);
    if (success) {
      setIsEditing(false);
      if (onComplete) onComplete();
    }
  };

  const handleSelectResume = (resume: UserResume) => {
    setSelectedResume(resume);
    setFormData(resume);
    setIsEditing(false);
  };

  const addExperience = () => {
    const experiences = formData.experiences || [];
    setFormData({
      ...formData,
      experiences: [...experiences, { company: '', role: '', period: '', description: '' }]
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const experiences = [...(formData.experiences || [])];
    experiences[index] = { ...experiences[index], [field]: value };
    setFormData({ ...formData, experiences });
  };

  const removeExperience = (index: number) => {
    const experiences = (formData.experiences || []).filter((_, i) => i !== index);
    setFormData({ ...formData, experiences });
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle>Construtor de Currículo Migrei</CardTitle>
              <p className="text-sm text-muted-foreground">
                Crie currículos estratégicos para sua nova área
              </p>
            </div>
          </div>
          <Button onClick={handleCreateNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Currículo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resume versions */}
        {resumes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resumes.map((resume) => (
              <Badge
                key={resume.id}
                variant={selectedResume?.id === resume.id ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleSelectResume(resume)}
              >
                {resume.version_name}
                {resume.is_current && <span className="ml-1 text-xs">(atual)</span>}
              </Badge>
            ))}
          </div>
        )}

        {selectedResume && (
          <AnimatedTabs defaultValue="info" className="w-full">
            <AnimatedTabsList className="grid w-full grid-cols-4">
              <AnimatedTabsTrigger value="info">Informações</AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="experience">Experiência</AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="education">Formação</AnimatedTabsTrigger>
              <AnimatedTabsTrigger value="skills">Habilidades</AnimatedTabsTrigger>
            </AnimatedTabsList>

            <AnimatedTabsContent value="info" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div>
                  <Label>Nome da versão</Label>
                  <Input
                    value={formData.version_name || ''}
                    onChange={(e) => setFormData({ ...formData, version_name: e.target.value })}
                    placeholder="Ex: Currículo para Tech"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Área alvo</Label>
                  <Input
                    value={formData.target_area || ''}
                    onChange={(e) => setFormData({ ...formData, target_area: e.target.value })}
                    placeholder="Ex: Product Management"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Resumo Profissional</Label>
                  <Textarea
                    value={formData.professional_summary || ''}
                    onChange={(e) => setFormData({ ...formData, professional_summary: e.target.value })}
                    placeholder="Descreva seu perfil profissional de forma estratégica..."
                    rows={4}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Dica: Foque em resultados e competências transferíveis para a nova área
                  </p>
                </div>
              </div>
            </AnimatedTabsContent>

            <AnimatedTabsContent value="experience" className="space-y-4 mt-4">
              {(formData.experiences || []).map((exp, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Experiência {index + 1}</h4>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        aria-label="Remover experiência"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        placeholder="Empresa"
                        disabled={!isEditing}
                      />
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExperience(index, 'role', e.target.value)}
                        placeholder="Cargo"
                        disabled={!isEditing}
                      />
                    </div>
                    <Input
                      value={exp.period}
                      onChange={(e) => updateExperience(index, 'period', e.target.value)}
                      placeholder="Período (ex: Jan 2020 - Dez 2023)"
                      disabled={!isEditing}
                    />
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Descreva suas responsabilidades e conquistas..."
                      rows={3}
                      disabled={!isEditing}
                    />
                  </div>
                </Card>
              ))}
              {isEditing && (
                <Button variant="outline" onClick={addExperience} className="w-full">
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Adicionar Experiência
                </Button>
              )}
            </AnimatedTabsContent>

            <AnimatedTabsContent value="education" className="space-y-4 mt-4">
              <div className="text-center text-muted-foreground py-8">
                <p>Adicione sua formação acadêmica</p>
                {isEditing && (
                  <Button variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                    Adicionar Formação
                  </Button>
                )}
              </div>
            </AnimatedTabsContent>

            <AnimatedTabsContent value="skills" className="space-y-4 mt-4">
              <div>
                <Label>Habilidades (separadas por vírgula)</Label>
                <Textarea
                  value={(formData.skills || []).join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                  })}
                  placeholder="Ex: Gestão de Projetos, Análise de Dados, Comunicação..."
                  rows={3}
                  disabled={!isEditing}
                />
              </div>
            </AnimatedTabsContent>
          </AnimatedTabs>
        )}

        {/* Action buttons */}
        {selectedResume && (
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </Button>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
            </div>
          </div>
        )}

        {resumes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum currículo ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie seu primeiro currículo estratégico para a transição
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Currículo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
