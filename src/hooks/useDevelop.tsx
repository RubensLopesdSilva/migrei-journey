import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { 
  UserResume, 
  ProfessionalPitch, 
  LinkedInChecklist, 
  PortfolioProject, 
  DevelopmentTrackItem,
  DevelopCoachFeedback 
} from '@/types/develop';

export function useDevelop() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [resumes, setResumes] = useState<UserResume[]>([]);
  const [pitch, setPitch] = useState<ProfessionalPitch | null>(null);
  const [linkedInChecklist, setLinkedInChecklist] = useState<LinkedInChecklist | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [developmentTrack, setDevelopmentTrack] = useState<DevelopmentTrackItem[]>([]);
  const [coachFeedback, setCoachFeedback] = useState<DevelopCoachFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const [resumesRes, pitchRes, linkedInRes, portfolioRes, trackRes, feedbackRes] = await Promise.all([
        supabase.from('user_resumes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('professional_pitches').select('*').eq('user_id', user.id).single(),
        supabase.from('linkedin_checklist').select('*').eq('user_id', user.id).single(),
        supabase.from('portfolio_projects').select('*').eq('user_id', user.id).order('sort_order'),
        supabase.from('development_track').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('develop_coach_feedback').select('*').eq('user_id', user.id).order('generated_at', { ascending: false })
      ]);

      if (resumesRes.data) setResumes(resumesRes.data as unknown as UserResume[]);
      if (pitchRes.data) setPitch(pitchRes.data as unknown as ProfessionalPitch);
      if (linkedInRes.data) setLinkedInChecklist(linkedInRes.data as unknown as LinkedInChecklist);
      if (portfolioRes.data) setPortfolioProjects(portfolioRes.data as unknown as PortfolioProject[]);
      if (trackRes.data) setDevelopmentTrack(trackRes.data as unknown as DevelopmentTrackItem[]);
      if (feedbackRes.data) setCoachFeedback(feedbackRes.data as unknown as DevelopCoachFeedback[]);
    } catch (error) {
      console.error('Error fetching develop data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resume functions
  const createResume = async (data: Partial<UserResume>) => {
    if (!user) return null;
    
    const { data: newResume, error } = await supabase
      .from('user_resumes')
      .insert({
        user_id: user.id,
        version_name: data.version_name || `Versão ${resumes.length + 1}`,
        target_area: data.target_area,
        personal_info: data.personal_info || {},
        professional_summary: data.professional_summary,
        experiences: data.experiences || [],
        education: data.education || [],
        skills: data.skills || [],
        languages: data.languages || [],
        certifications: data.certifications || []
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao criar currículo', variant: 'destructive' });
      return null;
    }

    setResumes(prev => [newResume as unknown as UserResume, ...prev]);
    toast({ title: 'Currículo criado com sucesso!' });
    return newResume;
  };

  const updateResume = async (id: string, data: Partial<UserResume>) => {
    const { error } = await supabase
      .from('user_resumes')
      .update(data)
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao atualizar currículo', variant: 'destructive' });
      return false;
    }

    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    toast({ title: 'Currículo atualizado!' });
    return true;
  };

  const deleteResume = async (id: string) => {
    const { error } = await supabase.from('user_resumes').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao excluir currículo', variant: 'destructive' });
      return false;
    }
    setResumes(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Currículo excluído!' });
    return true;
  };

  // Pitch functions
  const savePitch = async (data: Partial<ProfessionalPitch>) => {
    if (!user) return null;

    const fullPitch = [data.who_am_i, data.what_i_do, data.problem_i_solve]
      .filter(Boolean)
      .join(' ');

    if (pitch) {
      const { error } = await supabase
        .from('professional_pitches')
        .update({ ...data, full_pitch: fullPitch })
        .eq('id', pitch.id);

      if (error) {
        toast({ title: 'Erro ao atualizar pitch', variant: 'destructive' });
        return null;
      }

      setPitch(prev => prev ? { ...prev, ...data, full_pitch: fullPitch } : null);
    } else {
      const { data: newPitch, error } = await supabase
        .from('professional_pitches')
        .insert({
          user_id: user.id,
          ...data,
          full_pitch: fullPitch
        })
        .select()
        .single();

      if (error) {
        toast({ title: 'Erro ao criar pitch', variant: 'destructive' });
        return null;
      }

      setPitch(newPitch as unknown as ProfessionalPitch);
    }

    toast({ title: 'Pitch salvo com sucesso!' });
    return true;
  };

  const recordPitchPractice = async () => {
    if (!pitch) return;

    const { error } = await supabase
      .from('professional_pitches')
      .update({
        practice_count: pitch.practice_count + 1,
        last_practiced_at: new Date().toISOString()
      })
      .eq('id', pitch.id);

    if (!error) {
      setPitch(prev => prev ? {
        ...prev,
        practice_count: prev.practice_count + 1,
        last_practiced_at: new Date().toISOString()
      } : null);
    }
  };

  // LinkedIn checklist functions
  const saveLinkedInChecklist = async (data: Partial<LinkedInChecklist>) => {
    if (!user) return null;

    // Calculate overall score
    const checklistItems = [
      data.profile_photo ?? linkedInChecklist?.profile_photo,
      data.banner_image ?? linkedInChecklist?.banner_image,
      data.headline_optimized ?? linkedInChecklist?.headline_optimized,
      data.about_section ?? linkedInChecklist?.about_section,
      data.experience_updated ?? linkedInChecklist?.experience_updated,
      data.skills_added ?? linkedInChecklist?.skills_added
    ];
    const completedCount = checklistItems.filter(Boolean).length;
    const overall_score = Math.round((completedCount / 6) * 100);

    if (linkedInChecklist) {
      const { error } = await supabase
        .from('linkedin_checklist')
        .update({ ...data, overall_score })
        .eq('id', linkedInChecklist.id);

      if (error) {
        toast({ title: 'Erro ao atualizar checklist', variant: 'destructive' });
        return null;
      }

      setLinkedInChecklist(prev => prev ? { ...prev, ...data, overall_score } : null);
    } else {
      const { data: newChecklist, error } = await supabase
        .from('linkedin_checklist')
        .insert({
          user_id: user.id,
          ...data,
          overall_score
        })
        .select()
        .single();

      if (error) {
        toast({ title: 'Erro ao criar checklist', variant: 'destructive' });
        return null;
      }

      setLinkedInChecklist(newChecklist as unknown as LinkedInChecklist);
    }

    toast({ title: 'Checklist atualizado!' });
    return true;
  };

  // Portfolio functions
  const addPortfolioProject = async (data: Partial<PortfolioProject>) => {
    if (!user) return null;

    const { data: newProject, error } = await supabase
      .from('portfolio_projects')
      .insert({
        user_id: user.id,
        project_title: data.project_title || 'Novo Projeto',
        project_type: data.project_type || 'real',
        description: data.description,
        skills_used: data.skills_used || [],
        results: data.results,
        image_url: data.image_url,
        project_url: data.project_url,
        sort_order: portfolioProjects.length
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao adicionar projeto', variant: 'destructive' });
      return null;
    }

    setPortfolioProjects(prev => [...prev, newProject as unknown as PortfolioProject]);
    toast({ title: 'Projeto adicionado!' });
    return newProject;
  };

  const updatePortfolioProject = async (id: string, data: Partial<PortfolioProject>) => {
    const { error } = await supabase
      .from('portfolio_projects')
      .update(data)
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao atualizar projeto', variant: 'destructive' });
      return false;
    }

    setPortfolioProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    toast({ title: 'Projeto atualizado!' });
    return true;
  };

  const deletePortfolioProject = async (id: string) => {
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao excluir projeto', variant: 'destructive' });
      return false;
    }
    setPortfolioProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Projeto excluído!' });
    return true;
  };

  // Development track functions
  const addTrackItem = async (data: Partial<DevelopmentTrackItem>) => {
    if (!user) return null;

    const { data: newItem, error } = await supabase
      .from('development_track')
      .insert({
        user_id: user.id,
        item_type: data.item_type || 'course',
        title: data.title || 'Novo item',
        description: data.description,
        provider: data.provider,
        url: data.url,
        estimated_hours: data.estimated_hours,
        priority: data.priority || 'medium',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao adicionar item', variant: 'destructive' });
      return null;
    }

    setDevelopmentTrack(prev => [...prev, newItem as unknown as DevelopmentTrackItem]);
    toast({ title: 'Item adicionado à trilha!' });
    return newItem;
  };

  const updateTrackItem = async (id: string, data: Partial<DevelopmentTrackItem>) => {
    const updateData: any = { ...data };
    
    if (data.status === 'in_progress' && !developmentTrack.find(i => i.id === id)?.started_at) {
      updateData.started_at = new Date().toISOString();
    }
    if (data.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('development_track')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao atualizar item', variant: 'destructive' });
      return false;
    }

    setDevelopmentTrack(prev => prev.map(i => i.id === id ? { ...i, ...updateData } : i));
    toast({ title: 'Item atualizado!' });
    return true;
  };

  const deleteTrackItem = async (id: string) => {
    const { error } = await supabase.from('development_track').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao excluir item', variant: 'destructive' });
      return false;
    }
    setDevelopmentTrack(prev => prev.filter(i => i.id !== id));
    toast({ title: 'Item excluído!' });
    return true;
  };

  // Calculate phase progress
  const getPhaseProgress = () => {
    let completed = 0;
    const total = 6;

    if (resumes.length > 0) completed++;
    if (pitch?.full_pitch) completed++;
    if (linkedInChecklist && linkedInChecklist.overall_score >= 50) completed++;
    if (portfolioProjects.length >= 2) completed++;
    if (developmentTrack.filter(i => i.status === 'completed').length >= 3) completed++;
    if (coachFeedback.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  return {
    resumes,
    pitch,
    linkedInChecklist,
    portfolioProjects,
    developmentTrack,
    coachFeedback,
    isLoading,
    createResume,
    updateResume,
    deleteResume,
    savePitch,
    recordPitchPractice,
    saveLinkedInChecklist,
    addPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject,
    addTrackItem,
    updateTrackItem,
    deleteTrackItem,
    getPhaseProgress,
    refetch: fetchAllData
  };
}
