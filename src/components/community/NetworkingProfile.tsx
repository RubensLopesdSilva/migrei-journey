import { useState } from 'react';
import { User, Linkedin, Target, Briefcase, Lightbulb, Search, Gift, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { UserNetworkingProfile } from '@/types/community';

interface NetworkingProfileProps {
  profile: UserNetworkingProfile | null;
  onSave: (profile: Partial<UserNetworkingProfile>) => Promise<{ error: Error | null }>;
}

export function NetworkingProfile({ profile, onSave }: NetworkingProfileProps) {
  const [editing, setEditing] = useState(!profile);
  const [loading, setLoading] = useState(false);
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

  if (!editing && profile) {
    return (
      <Card className="card-elevated">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Meu Perfil de Networking
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.career_objective && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <Target className="h-4 w-4" />
                Objetivo de Carreira
              </div>
              <p className="text-foreground">{profile.career_objective}</p>
            </div>
          )}

          {profile.interest_areas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Lightbulb className="h-4 w-4" />
                Áreas de Interesse
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interest_areas.map(area => (
                  <Badge key={area} variant="secondary">{area}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.skills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <Briefcase className="h-4 w-4" />
                Habilidades
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.what_seeking && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <Search className="h-4 w-4" />
                O que busco
              </div>
              <p className="text-foreground">{profile.what_seeking}</p>
            </div>
          )}

          {profile.what_offering && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <Gift className="h-4 w-4" />
                O que ofereço
              </div>
              <p className="text-foreground">{profile.what_offering}</p>
            </div>
          )}

          {profile.linkedin_url && (
            <a 
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {profile ? 'Editar Perfil' : 'Complete seu Perfil de Networking'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="objective" className="mb-2 block">Objetivo de Carreira</Label>
          <Textarea
            id="objective"
            value={formData.career_objective}
            onChange={(e) => setFormData({ ...formData, career_objective: e.target.value })}
            placeholder="Qual é seu objetivo de transição de carreira?"
            className="resize-none"
          />
        </div>

        <div>
          <Label className="mb-2 block">Áreas de Interesse</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Ex: Tecnologia, Marketing..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            />
            <Button type="button" variant="outline" onClick={addInterest}>Adicionar</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interest_areas.map(area => (
              <Badge 
                key={area} 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeInterest(area)}
              >
                {area} ×
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="experience" className="mb-2 block">Experiência Anterior</Label>
          <Textarea
            id="experience"
            value={formData.previous_experience}
            onChange={(e) => setFormData({ ...formData, previous_experience: e.target.value })}
            placeholder="Resuma sua experiência profissional"
            className="resize-none"
          />
        </div>

        <div>
          <Label className="mb-2 block">Habilidades</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Ex: Gestão de projetos, Python..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" variant="outline" onClick={addSkill}>Adicionar</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <Badge 
                key={skill} 
                variant="outline"
                className="cursor-pointer"
                onClick={() => removeSkill(skill)}
              >
                {skill} ×
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="seeking" className="mb-2 block">O que você busca?</Label>
          <Textarea
            id="seeking"
            value={formData.what_seeking}
            onChange={(e) => setFormData({ ...formData, what_seeking: e.target.value })}
            placeholder="O que você procura na comunidade?"
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="offering" className="mb-2 block">O que você oferece?</Label>
          <Textarea
            id="offering"
            value={formData.what_offering}
            onChange={(e) => setFormData({ ...formData, what_offering: e.target.value })}
            placeholder="Como você pode ajudar outros membros?"
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="linkedin" className="mb-2 block">LinkedIn (opcional)</Label>
          <Input
            id="linkedin"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/seu-perfil"
          />
        </div>

        <div className="flex justify-end gap-3">
          {profile && (
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
