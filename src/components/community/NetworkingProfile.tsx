import { useState } from 'react';
import { User, Linkedin, Target, Briefcase, Search, Gift, Save, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { UserNetworkingProfile } from '@/types/community';

interface NetworkingProfileProps {
  profile: UserNetworkingProfile | null;
  onSave: (profile: Partial<UserNetworkingProfile>) => Promise<{ error: Error | null }>;
}

export function NetworkingProfile({ profile, onSave }: NetworkingProfileProps) {
  const [editing, setEditing] = useState(!profile);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    career_objective: profile?.career_objective || '',
    interest_areas: profile?.interest_areas || [],
    previous_experience: profile?.previous_experience || '',
    skills: profile?.skills || [],
    what_seeking: profile?.what_seeking || '',
    what_offering: profile?.what_offering || '',
    linkedin_url: profile?.linkedin_url || ''
  });
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await onSave(formData);
    if (!error) setEditing(false);
    setLoading(false);
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interest_areas.includes(newInterest.trim())) {
      setFormData({ ...formData, interest_areas: [...formData.interest_areas, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interest_areas: formData.interest_areas.filter(i => i !== interest) });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  // View mode - Clean and minimal
  if (!editing && profile) {
    const hasDetails = profile.what_seeking || profile.what_offering || profile.previous_experience;
    
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" />
              Meu Perfil
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setEditing(true)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          {/* Objetivo - Sempre visível */}
          {profile.career_objective && (
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">{profile.career_objective}</p>
            </div>
          )}

          {/* Skills & Interests - Compacto */}
          {(profile.skills.length > 0 || profile.interest_areas.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 4).map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs font-normal">
                  {skill}
                </Badge>
              ))}
              {profile.interest_areas.slice(0, 2).map(area => (
                <Badge key={area} variant="outline" className="text-xs font-normal">
                  {area}
                </Badge>
              ))}
              {(profile.skills.length + profile.interest_areas.length) > 6 && (
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                  +{(profile.skills.length + profile.interest_areas.length) - 6}
                </Badge>
              )}
            </div>
          )}

          {/* Busco / Ofereço - Collapsible */}
          {hasDetails && (
            <Collapsible open={expanded} onOpenChange={setExpanded}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  {expanded ? 'Ver menos' : 'Ver detalhes'}
                  {expanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-3 pt-2">
                {profile.what_seeking && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
                    <Search className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Busco</p>
                      <p className="text-sm text-foreground">{profile.what_seeking}</p>
                    </div>
                  </div>
                )}

                {profile.what_offering && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
                    <Gift className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">Ofereço</p>
                      <p className="text-sm text-foreground">{profile.what_offering}</p>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* LinkedIn - Discreto */}
          {profile.linkedin_url && (
            <a 
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              Ver LinkedIn
            </a>
          )}
        </CardContent>
      </Card>
    );
  }

  // Edit mode - Simplificado
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4 text-primary" />
          {profile ? 'Editar Perfil' : 'Complete seu Perfil'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Objetivo */}
        <div>
          <Label htmlFor="objective" className="text-xs font-medium text-muted-foreground">
            Objetivo de Carreira
          </Label>
          <Textarea
            id="objective"
            value={formData.career_objective}
            onChange={(e) => setFormData({ ...formData, career_objective: e.target.value })}
            placeholder="Qual é seu objetivo?"
            className="resize-none mt-1.5 text-sm min-h-[60px]"
          />
        </div>

        {/* Habilidades */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Habilidades</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ex: Gestão, Python..."
              className="text-sm"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" variant="outline" size="sm" onClick={addSkill}>+</Button>
          </div>
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {formData.skills.map(skill => (
                <Badge 
                  key={skill} 
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => removeSkill(skill)}
                >
                  {skill} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Áreas de Interesse */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Áreas de Interesse</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Ex: Tecnologia, Marketing..."
              className="text-sm"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            />
            <Button type="button" variant="outline" size="sm" onClick={addInterest}>+</Button>
          </div>
          {formData.interest_areas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {formData.interest_areas.map(area => (
                <Badge 
                  key={area} 
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => removeInterest(area)}
                >
                  {area} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Busco / Ofereço */}
        <div className="grid gap-3">
          <div>
            <Label htmlFor="seeking" className="text-xs font-medium text-muted-foreground">
              O que você busca?
            </Label>
            <Textarea
              id="seeking"
              value={formData.what_seeking}
              onChange={(e) => setFormData({ ...formData, what_seeking: e.target.value })}
              placeholder="O que procura na comunidade?"
              className="resize-none mt-1.5 text-sm min-h-[50px]"
            />
          </div>

          <div>
            <Label htmlFor="offering" className="text-xs font-medium text-muted-foreground">
              O que você oferece?
            </Label>
            <Textarea
              id="offering"
              value={formData.what_offering}
              onChange={(e) => setFormData({ ...formData, what_offering: e.target.value })}
              placeholder="Como pode ajudar outros?"
              className="resize-none mt-1.5 text-sm min-h-[50px]"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <Label htmlFor="linkedin" className="text-xs font-medium text-muted-foreground">
            LinkedIn (opcional)
          </Label>
          <Input
            id="linkedin"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/..."
            className="mt-1.5 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          {profile && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading} size="sm" className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}