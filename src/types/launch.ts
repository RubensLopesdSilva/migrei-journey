export interface ExecutionPanelItem {
  id: string;
  user_id: string;
  panel_type: 'job_application' | 'networking' | 'followup';
  title: string;
  company?: string;
  contact_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  notes?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OpportunityDiaryEntry {
  id: string;
  user_id: string;
  entry_type: 'conversation' | 'referral' | 'selection_process';
  title: string;
  description?: string;
  contact_name?: string;
  company?: string;
  outcome?: string;
  next_steps?: string;
  importance_level: number;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkingRoutineItem {
  id: string;
  user_id: string;
  action_type: 'comment' | 'connect' | 'message';
  target_name?: string;
  target_profile_url?: string;
  action_description?: string;
  completed: boolean;
  completed_at?: string;
  scheduled_date: string;
  created_at: string;
}

export interface InterviewSimulation {
  id: string;
  user_id: string;
  area: string;
  question: string;
  user_response?: string;
  ai_feedback?: string;
  score?: number;
  practiced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyCheckin {
  id: string;
  user_id: string;
  week_start: string;
  what_worked?: string;
  what_blocked?: string;
  suggested_adjustments?: string;
  energy_level: number;
  confidence_level: number;
  goals_next_week?: string;
  created_at: string;
  updated_at: string;
}

export const PANEL_TYPE_LABELS: Record<string, string> = {
  job_application: 'Vaga Aplicada',
  networking: 'Networking',
  followup: 'Follow-up'
};

export const PANEL_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  rejected: 'Rejeitado'
};

export const ENTRY_TYPE_LABELS: Record<string, string> = {
  conversation: 'Conversa',
  referral: 'Indicação',
  selection_process: 'Processo Seletivo'
};

export const ACTION_TYPE_LABELS: Record<string, string> = {
  comment: 'Comentar',
  connect: 'Conectar',
  message: 'Enviar Mensagem'
};

export const INTERVIEW_AREAS = [
  'Tecnologia',
  'Marketing',
  'Vendas',
  'RH',
  'Finanças',
  'Design',
  'Gestão de Projetos',
  'Consultoria',
  'Educação',
  'Saúde'
];

export const INTERVIEW_QUESTIONS: Record<string, string[]> = {
  'Tecnologia': [
    'Conte sobre um projeto técnico desafiador que você liderou.',
    'Como você se mantém atualizado com as novas tecnologias?',
    'Descreva uma situação onde você resolveu um bug crítico em produção.',
    'Como você lida com prazos apertados em projetos técnicos?'
  ],
  'Marketing': [
    'Qual foi sua campanha de maior sucesso e por quê?',
    'Como você mede o ROI de suas estratégias de marketing?',
    'Descreva uma campanha que não deu certo e o que aprendeu.',
    'Como você adapta estratégias para diferentes públicos-alvo?'
  ],
  'Vendas': [
    'Qual foi sua maior negociação e como você a conduziu?',
    'Como você lida com objeções de clientes?',
    'Descreva seu processo de prospecção de novos clientes.',
    'Como você mantém relacionamentos com clientes de longo prazo?'
  ],
  'RH': [
    'Como você lida com conflitos entre funcionários?',
    'Descreva um processo de recrutamento bem-sucedido que você conduziu.',
    'Como você mede a satisfação dos colaboradores?',
    'Qual sua abordagem para desenvolvimento de talentos?'
  ],
  'Finanças': [
    'Descreva uma análise financeira complexa que você realizou.',
    'Como você lida com incertezas em projeções financeiras?',
    'Qual foi uma recomendação estratégica baseada em dados que você fez?',
    'Como você comunica informações financeiras para não-especialistas?'
  ],
  'Design': [
    'Como você aborda um novo projeto de design?',
    'Descreva como você incorpora feedback do usuário em seus designs.',
    'Qual projeto de design você mais se orgulha e por quê?',
    'Como você equilibra estética e funcionalidade?'
  ],
  'Gestão de Projetos': [
    'Como você lida com mudanças de escopo em projetos?',
    'Descreva como você gerencia stakeholders com expectativas conflitantes.',
    'Qual foi o projeto mais desafiador que você gerenciou?',
    'Como você prioriza tarefas quando tudo é urgente?'
  ],
  'Consultoria': [
    'Descreva um projeto de consultoria que gerou grande impacto.',
    'Como você constrói credibilidade rapidamente com novos clientes?',
    'Qual abordagem você usa para diagnosticar problemas organizacionais?',
    'Como você lida com resistência a mudanças?'
  ],
  'Educação': [
    'Como você adapta seu ensino para diferentes estilos de aprendizagem?',
    'Descreva uma metodologia inovadora que você implementou.',
    'Como você mede o sucesso do aprendizado dos alunos?',
    'Qual foi seu maior desafio como educador?'
  ],
  'Saúde': [
    'Como você lida com situações de alta pressão no ambiente de saúde?',
    'Descreva como você se comunica com pacientes em situações difíceis.',
    'Qual foi uma melhoria de processo que você implementou?',
    'Como você se mantém atualizado com avanços na sua área?'
  ]
};
