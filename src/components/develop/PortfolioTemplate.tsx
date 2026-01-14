import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Plus, Star, Trash2, ExternalLink, Image } from 'lucide-react';
import type { PortfolioProject } from '@/types/develop';

interface PortfolioTemplateProps {
  projects: PortfolioProject[];
  onAddProject: (data: Partial<PortfolioProject>) => Promise<any>;
  onUpdateProject: (id: string, data: Partial<PortfolioProject>) => Promise<boolean>;
  onDeleteProject: (id: string) => Promise<boolean>;
  onComplete?: () => void;
}

export function PortfolioTemplate({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onComplete
}: PortfolioTemplateProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioProject>>({
    project_title: '',
    project_type: 'real',
    description: '',
    skills_used: [],
    results: '',
    project_url: ''
  });
  const [skillInput, setSkillInput] = useState('');

  const handleOpenNew = () => {
    setEditingProject(null);
    setFormData({
      project_title: '',
      project_type: 'real',
      description: '',
      skills_used: [],
      results: '',
      project_url: ''
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: PortfolioProject) => {
    setEditingProject(project);
    setFormData(project);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingProject) {
      await onUpdateProject(editingProject.id, formData);
    } else {
      await onAddProject(formData);
    }
    setIsDialogOpen(false);
    if (projects.length >= 1 && onComplete) {
      onComplete();
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setFormData({
      ...formData,
      skills_used: [...(formData.skills_used || []), skillInput.trim()]
    });
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills_used: (formData.skills_used || []).filter((_, i) => i !== index)
    });
  };

  const toggleFeatured = async (project: PortfolioProject) => {
    await onUpdateProject(project.id, { is_featured: !project.is_featured });
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Modelo de Portfólio</CardTitle>
              <p className="text-sm text-muted-foreground">
                Projetos reais ou simulados para demonstrar suas habilidades
              </p>
            </div>
          </div>
          <Button onClick={handleOpenNew}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Projects grid */}
        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Card
                key={project.id}
                className={`relative overflow-hidden ${
                  project.is_featured ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                {/* Project image placeholder */}
                <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.project_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{project.project_title}</h4>
                      <Badge variant={project.project_type === 'real' ? 'default' : 'secondary'} className="mt-1">
                        {project.project_type === 'real' ? 'Projeto Real' : 'Projeto Simulado'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatured(project)}
                      className={project.is_featured ? 'text-orange-500' : 'text-muted-foreground'}
                    >
                      <Star className={`w-4 h-4 ${project.is_featured ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(project.skills_used || []).slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {(project.skills_used || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(project.skills_used || []).length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(project)}
                    >
                      Editar
                    </Button>
                    {project.project_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum projeto no portfólio</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione projetos reais ou crie projetos simulados para demonstrar suas habilidades
            </p>
            <Button onClick={handleOpenNew}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Projeto
            </Button>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título do Projeto</Label>
                <Input
                  value={formData.project_title || ''}
                  onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                  placeholder="Ex: App de Gestão Financeira"
                />
              </div>

              <div>
                <Label>Tipo de Projeto</Label>
                <Select
                  value={formData.project_type}
                  onValueChange={(value: 'real' | 'simulated') => 
                    setFormData({ ...formData, project_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real">Projeto Real</SelectItem>
                    <SelectItem value="simulated">Projeto Simulado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o projeto, contexto e seu papel..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Resultados Alcançados</Label>
                <Textarea
                  value={formData.results || ''}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  placeholder="Ex: Aumento de 30% na eficiência..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Habilidades Utilizadas</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Adicionar habilidade"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button variant="outline" onClick={addSkill}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.skills_used || []).map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeSkill(i)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>URL do Projeto (opcional)</Label>
                <Input
                  value={formData.project_url || ''}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingProject ? 'Salvar Alterações' : 'Adicionar Projeto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
