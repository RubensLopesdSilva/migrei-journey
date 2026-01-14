import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Check, AlertCircle, Sparkles } from 'lucide-react';
import type { LinkedInChecklist as LinkedInChecklistType } from '@/types/develop';

interface LinkedInChecklistProps {
  checklist: LinkedInChecklistType | null;
  onSave: (data: Partial<LinkedInChecklistType>) => Promise<any>;
  onComplete?: () => void;
}

const checklistItems = [
  { key: 'profile_photo', label: 'Foto de perfil profissional', tip: 'Use uma foto nítida, com fundo neutro e sorriso natural' },
  { key: 'banner_image', label: 'Imagem de capa personalizada', tip: 'Crie uma capa que reflita sua área de atuação' },
  { key: 'headline_optimized', label: 'Título otimizado', tip: 'Use palavras-chave da sua nova área' },
  { key: 'about_section', label: 'Seção Sobre completa', tip: 'Conte sua história de transição de forma envolvente' },
  { key: 'experience_updated', label: 'Experiências atualizadas', tip: 'Destaque competências transferíveis' },
  { key: 'skills_added', label: 'Competências adicionadas', tip: 'Adicione skills relevantes para a nova área' }
];

export function LinkedInChecklist({ checklist, onSave, onComplete }: LinkedInChecklistProps) {
  const [formData, setFormData] = useState<Partial<LinkedInChecklistType>>({
    profile_photo: checklist?.profile_photo || false,
    banner_image: checklist?.banner_image || false,
    headline_optimized: checklist?.headline_optimized || false,
    headline_text: checklist?.headline_text || '',
    about_section: checklist?.about_section || false,
    about_text: checklist?.about_text || '',
    experience_updated: checklist?.experience_updated || false,
    skills_added: checklist?.skills_added || false,
    keywords: checklist?.keywords || [],
    recommendations_count: checklist?.recommendations_count || 0,
    connections_count: checklist?.connections_count || 0
  });

  const [keywordInput, setKeywordInput] = useState('');

  const completedCount = checklistItems.filter(
    item => formData[item.key as keyof typeof formData] === true
  ).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  const handleToggle = async (key: string, checked: boolean) => {
    const newData = { ...formData, [key]: checked };
    setFormData(newData);
    await onSave({ [key]: checked });
    
    if (progressPercent >= 80 && onComplete) {
      onComplete();
    }
  };

  const handleTextSave = async (key: string, value: string) => {
    await onSave({ [key]: value });
  };

  const addKeyword = async () => {
    if (!keywordInput.trim()) return;
    const keywords = [...(formData.keywords || []), keywordInput.trim()];
    setFormData({ ...formData, keywords });
    await onSave({ keywords });
    setKeywordInput('');
  };

  const removeKeyword = async (index: number) => {
    const keywords = (formData.keywords || []).filter((_, i) => i !== index);
    setFormData({ ...formData, keywords });
    await onSave({ keywords });
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Checklist de LinkedIn Migrei</CardTitle>
              <p className="text-sm text-muted-foreground">
                Otimize seu perfil para a transição
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-orange-600">{progressPercent}%</span>
            <p className="text-xs text-muted-foreground">completo</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress bar */}
        <div>
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{completedCount} de {checklistItems.length} itens</span>
            {progressPercent >= 80 ? (
              <span className="text-green-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Perfil otimizado!
              </span>
            ) : (
              <span className="text-yellow-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Continue melhorando
              </span>
            )}
          </div>
        </div>

        {/* Checklist items */}
        <div className="space-y-4">
          {checklistItems.map((item) => (
            <div
              key={item.key}
              className={`p-4 rounded-lg border ${
                formData[item.key as keyof typeof formData] 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={item.key}
                  checked={formData[item.key as keyof typeof formData] as boolean}
                  onCheckedChange={(checked) => handleToggle(item.key, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={item.key} className="cursor-pointer font-medium">
                    {item.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{item.tip}</p>
                </div>
                {formData[item.key as keyof typeof formData] && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Headline input */}
        <div className="space-y-2">
          <Label>Seu título profissional</Label>
          <Input
            value={formData.headline_text || ''}
            onChange={(e) => setFormData({ ...formData, headline_text: e.target.value })}
            onBlur={(e) => handleTextSave('headline_text', e.target.value)}
            placeholder="Ex: Profissional em Transição | Ex-Finanças → Product Manager"
          />
          <p className="text-xs text-muted-foreground">
            💡 Inclua palavras-chave da nova área e mostre sua trajetória
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label>Palavras-chave estratégicas</Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Adicionar palavra-chave"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button onClick={addKeyword} variant="outline">
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(formData.keywords || []).map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeKeyword(index)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* About section */}
        <div className="space-y-2">
          <Label>Seção "Sobre" (rascunho)</Label>
          <Textarea
            value={formData.about_text || ''}
            onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
            onBlur={(e) => handleTextSave('about_text', e.target.value)}
            placeholder="Escreva aqui o rascunho da sua seção Sobre..."
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}
