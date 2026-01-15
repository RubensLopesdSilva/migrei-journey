-- Limpar atividades existentes e inserir missões reais contextualizadas
DELETE FROM phase_activities;

-- FASE 1: DESPERTAR - Percepção da necessidade de mudança
INSERT INTO phase_activities (phase_id, title, description, activity_type, is_checkpoint, is_required, xp_reward, sort_order, estimated_minutes) VALUES
-- Despertar
('25fd7273-3ba2-4104-964d-d0126db222a7', 'Complete seu perfil profissional', 'Adicione sua foto, bio e informações de carreira para personalizar sua jornada', 'lesson', false, true, 25, 1, 10),
('25fd7273-3ba2-4104-964d-d0126db222a7', 'Faça o Teste de Prontidão', 'Avalie seu nível de preparação para a transição de carreira', 'quiz', false, true, 30, 2, 15),
('25fd7273-3ba2-4104-964d-d0126db222a7', 'Mapeie suas dores profissionais', 'Identifique e registre o que te incomoda na sua situação atual', 'reflection', false, true, 25, 3, 20),
('25fd7273-3ba2-4104-964d-d0126db222a7', 'Declare seu compromisso', 'Assine sua declaração de compromisso com a mudança', 'checkpoint', true, true, 40, 4, 10),

-- FASE 2: DESCOBRIR - Autoconhecimento e diagnóstico
('37e71aad-c20d-4917-8bb9-24b5e4581295', 'Preencha a Roda da Carreira', 'Avalie 8 dimensões profissionais para entender sua situação atual', 'exercise', false, true, 35, 1, 25),
('37e71aad-c20d-4917-8bb9-24b5e4581295', 'Monte sua Linha do Tempo Profissional', 'Documente sua trajetória e experiências relevantes', 'exercise', false, true, 30, 2, 30),
('37e71aad-c20d-4917-8bb9-24b5e4581295', 'Complete um Diagnóstico de Perfil', 'Descubra seu estilo comportamental e preferências profissionais', 'quiz', false, true, 35, 3, 20),
('37e71aad-c20d-4917-8bb9-24b5e4581295', 'Explore Profissões Recomendadas', 'Analise as sugestões de carreira baseadas no seu perfil', 'lesson', false, true, 25, 4, 15),
('37e71aad-c20d-4917-8bb9-24b5e4581295', 'Gere seu Relatório de Clareza', 'Consolide suas descobertas em um relatório profissional', 'checkpoint', true, true, 50, 5, 20),

-- FASE 3: DECIDIR - Definição estratégica
('64d37520-9a92-4628-b778-7f18580337c7', 'Compare Rotas de Carreira', 'Analise diferentes caminhos profissionais e suas implicações', 'exercise', false, true, 40, 1, 30),
('64d37520-9a92-4628-b778-7f18580337c7', 'Mapeie Lacunas de Competência', 'Identifique gaps entre seu perfil atual e o desejado', 'exercise', false, true, 35, 2, 25),
('64d37520-9a92-4628-b778-7f18580337c7', 'Defina sua Meta SMART', 'Crie um objetivo claro, específico e mensurável', 'exercise', false, true, 45, 3, 20),
('64d37520-9a92-4628-b778-7f18580337c7', 'Monte seu Plano de 90 Dias', 'Estruture os próximos passos com marcos e prazos', 'checkpoint', true, true, 55, 4, 40),

-- FASE 4: DESENVOLVER - Construção de competências
('ec605879-40ea-4243-a7e2-46b0abaa11e2', 'Otimize seu LinkedIn', 'Complete o checklist de otimização do seu perfil profissional', 'exercise', false, true, 40, 1, 45),
('ec605879-40ea-4243-a7e2-46b0abaa11e2', 'Crie seu Pitch de Apresentação', 'Prepare uma apresentação pessoal impactante', 'exercise', false, true, 35, 2, 30),
('ec605879-40ea-4243-a7e2-46b0abaa11e2', 'Atualize seu Currículo', 'Use o builder para criar um currículo estratégico', 'exercise', false, true, 40, 3, 40),
('ec605879-40ea-4243-a7e2-46b0abaa11e2', 'Monte seu Portfólio de Projetos', 'Documente realizações e projetos relevantes', 'checkpoint', true, true, 55, 4, 60),

-- FASE 5: DESLANCHAR - Execução prática
('ad769395-7cf7-475c-91d4-3b1a25bc62d0', 'Registre uma Oportunidade', 'Documente uma vaga ou oportunidade identificada', 'exercise', false, true, 30, 1, 15),
('ad769395-7cf7-475c-91d4-3b1a25bc62d0', 'Pratique com o Simulador de Entrevistas', 'Treine respostas para perguntas comuns de entrevista', 'exercise', false, true, 45, 2, 30),
('ad769395-7cf7-475c-91d4-3b1a25bc62d0', 'Complete sua Rotina de Networking', 'Faça 3 conexões estratégicas esta semana', 'exercise', false, true, 35, 3, 20),
('ad769395-7cf7-475c-91d4-3b1a25bc62d0', 'Realize o Check-in Semanal', 'Reflita sobre seu progresso e ajuste sua estratégia', 'checkpoint', true, true, 40, 4, 15),

-- FASE 6: DESFRUTAR - Consolidação e celebração
('6322f2eb-d87b-46be-858a-7a00f20111ba', 'Avalie seus Resultados', 'Compare sua situação antes e depois da jornada', 'reflection', false, true, 40, 1, 25),
('6322f2eb-d87b-46be-858a-7a00f20111ba', 'Celebre suas Conquistas', 'Reconheça e documente suas vitórias na jornada', 'exercise', false, true, 35, 2, 15),
('6322f2eb-d87b-46be-858a-7a00f20111ba', 'Gere seu Relatório Final', 'Consolide todos os aprendizados em um documento', 'exercise', false, true, 50, 3, 30),
('6322f2eb-d87b-46be-858a-7a00f20111ba', 'Planeje seu Próximo Ciclo', 'Defina novos objetivos para continuar evoluindo', 'checkpoint', true, true, 60, 4, 20);

-- Limpar completions de atividades antigas (que não existem mais)
DELETE FROM user_activity_completions WHERE activity_id NOT IN (SELECT id FROM phase_activities);