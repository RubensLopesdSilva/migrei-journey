-- =============================================
-- USER STREAKS TABLE
-- =============================================
CREATE TABLE public.user_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    current_streak integer NOT NULL DEFAULT 0,
    longest_streak integer NOT NULL DEFAULT 0,
    last_activity_date date,
    streak_started_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own streak" ON public.user_streaks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak" ON public.user_streaks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON public.user_streaks
FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_streaks_updated_at
    BEFORE UPDATE ON public.user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update streak on activity
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id uuid)
RETURNS TABLE (
    current_streak integer,
    longest_streak integer,
    streak_broken boolean,
    is_new_record boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_streak RECORD;
    v_today date := CURRENT_DATE;
    v_yesterday date := CURRENT_DATE - 1;
    v_streak_broken boolean := false;
    v_is_new_record boolean := false;
    v_new_current integer;
    v_new_longest integer;
BEGIN
    -- Get or create streak record
    SELECT * INTO v_streak FROM user_streaks WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        -- Create new streak
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_started_at)
        VALUES (p_user_id, 1, 1, v_today, now())
        RETURNING user_streaks.current_streak, user_streaks.longest_streak INTO v_new_current, v_new_longest;
        
        RETURN QUERY SELECT v_new_current, v_new_longest, false, true;
        RETURN;
    END IF;
    
    -- Check if already logged today
    IF v_streak.last_activity_date = v_today THEN
        -- Already logged today, no change
        RETURN QUERY SELECT v_streak.current_streak, v_streak.longest_streak, false, false;
        RETURN;
    END IF;
    
    -- Check if streak continues (yesterday) or breaks
    IF v_streak.last_activity_date = v_yesterday THEN
        -- Streak continues
        v_new_current := v_streak.current_streak + 1;
        v_new_longest := GREATEST(v_streak.longest_streak, v_new_current);
        v_is_new_record := v_new_current > v_streak.longest_streak;
        
        UPDATE user_streaks
        SET current_streak = v_new_current,
            longest_streak = v_new_longest,
            last_activity_date = v_today,
            updated_at = now()
        WHERE user_id = p_user_id;
    ELSE
        -- Streak broken, start new one
        v_streak_broken := v_streak.current_streak > 1;
        v_new_current := 1;
        v_new_longest := v_streak.longest_streak;
        
        UPDATE user_streaks
        SET current_streak = 1,
            last_activity_date = v_today,
            streak_started_at = now(),
            updated_at = now()
        WHERE user_id = p_user_id;
    END IF;
    
    RETURN QUERY SELECT v_new_current, v_new_longest, v_streak_broken, v_is_new_record;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.update_user_streak TO authenticated;