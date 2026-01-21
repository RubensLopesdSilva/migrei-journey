-- Update the free plan to remove community/networking access
UPDATE plan_features 
SET feature_value = 'false'::jsonb
WHERE feature_key = 'community_access' 
AND plan_id = (SELECT id FROM subscription_plans WHERE slug = 'free');