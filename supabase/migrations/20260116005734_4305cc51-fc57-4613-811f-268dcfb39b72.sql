-- Atualizar features do plano FREE
UPDATE plan_features SET feature_value = 'false' 
WHERE plan_id = '5660e1dc-7518-44e2-b94d-fcdd50644073' AND feature_key = 'ai_assistant';

UPDATE plan_features SET feature_value = '0' 
WHERE plan_id = '5660e1dc-7518-44e2-b94d-fcdd50644073' AND feature_key = 'mentoring_sessions_limit';

-- Adicionar max_phase_access para FREE (até fase 2)
INSERT INTO plan_features (plan_id, feature_key, feature_name, feature_value, description)
VALUES ('5660e1dc-7518-44e2-b94d-fcdd50644073', 'max_phase_access', 'Acesso às Fases', '2', 'Número máximo de fases acessíveis')
ON CONFLICT (plan_id, feature_key) DO UPDATE SET feature_value = '2';

-- Atualizar features do plano ESSENCIAL
UPDATE plan_features SET feature_value = 'true' 
WHERE plan_id = 'eba54b33-9f8f-457a-b463-4cc21148ee60' AND feature_key = 'ai_assistant';

UPDATE plan_features SET feature_value = '0' 
WHERE plan_id = 'eba54b33-9f8f-457a-b463-4cc21148ee60' AND feature_key = 'mentoring_sessions_limit';

UPDATE plan_features SET feature_value = 'false' 
WHERE plan_id = 'eba54b33-9f8f-457a-b463-4cc21148ee60' AND feature_key = 'exclusive_content';

-- Adicionar max_phase_access para ESSENCIAL (todas as fases)
INSERT INTO plan_features (plan_id, feature_key, feature_name, feature_value, description)
VALUES ('eba54b33-9f8f-457a-b463-4cc21148ee60', 'max_phase_access', 'Acesso às Fases', '6', 'Número máximo de fases acessíveis')
ON CONFLICT (plan_id, feature_key) DO UPDATE SET feature_value = '6';

-- Atualizar features do plano PREMIUM
UPDATE plan_features SET feature_value = '1' 
WHERE plan_id = 'acb33f44-7f03-4c14-bf93-50a4b7568a87' AND feature_key = 'mentoring_sessions_limit';

-- Adicionar max_phase_access para PREMIUM (todas as fases)
INSERT INTO plan_features (plan_id, feature_key, feature_name, feature_value, description)
VALUES ('acb33f44-7f03-4c14-bf93-50a4b7568a87', 'max_phase_access', 'Acesso às Fases', '6', 'Número máximo de fases acessíveis')
ON CONFLICT (plan_id, feature_key) DO UPDATE SET feature_value = '6';