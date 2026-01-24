import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateRoomRequest {
  session_id: string;
}

interface JoinRoomRequest {
  session_id: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
    if (!DAILY_API_KEY) {
      console.error("DAILY_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Daily.co API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();
    const body = await req.json();

    if (action === "create" || req.method === "POST") {
      // Create or get room for a session
      const { session_id } = body as CreateRoomRequest;
      
      if (!session_id) {
        return new Response(
          JSON.stringify({ error: "session_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get session details and verify user is part of this session
      const { data: session, error: sessionError } = await supabase
        .from("mentoring_sessions")
        .select(`
          id,
          mentor_id,
          mentee_id,
          scheduled_at,
          duration_minutes,
          meeting_url,
          status,
          mentor:mentors(user_id, name)
        `)
        .eq("id", session_id)
        .single();

      if (sessionError || !session) {
        console.error("Session not found:", sessionError);
        return new Response(
          JSON.stringify({ error: "Session not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user is mentor or mentee
      const mentorData = session.mentor as unknown;
      const mentor = Array.isArray(mentorData) ? mentorData[0] : mentorData;
      const mentorInfo = mentor as { user_id: string | null; name: string } | null;
      const isMentor = mentorInfo?.user_id === user.id;
      const isMentee = session.mentee_id === user.id;
      
      if (!isMentor && !isMentee) {
        return new Response(
          JSON.stringify({ error: "You are not part of this session" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If room already exists, return existing URL with a token
      if (session.meeting_url && session.meeting_url.includes("daily.co")) {
        const roomName = session.meeting_url.split("/").pop();
        
        // Create a meeting token for the user
        const tokenResponse = await fetch("https://api.daily.co/v1/meeting-tokens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DAILY_API_KEY}`,
          },
          body: JSON.stringify({
            properties: {
              room_name: roomName,
              user_name: isMentor ? mentorInfo?.name : "Mentee",
              is_owner: isMentor,
              enable_screenshare: true,
              exp: Math.floor(Date.now() / 1000) + (session.duration_minutes + 30) * 60,
            },
          }),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error("Failed to create token:", errorText);
          return new Response(
            JSON.stringify({ error: "Failed to create meeting token" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const tokenData = await tokenResponse.json();
        
        return new Response(
          JSON.stringify({
            room_url: session.meeting_url,
            token: tokenData.token,
            is_owner: isMentor,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create new Daily.co room
      const roomName = `migrei-session-${session_id.slice(0, 8)}`;
      const scheduledTime = new Date(session.scheduled_at);
      const expirationTime = new Date(scheduledTime.getTime() + (session.duration_minutes + 60) * 60 * 1000);

      console.log("Creating Daily.co room:", roomName);

      const roomResponse = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName,
          privacy: "private",
          properties: {
            exp: Math.floor(expirationTime.getTime() / 1000),
            max_participants: 2,
            enable_screenshare: true,
            enable_chat: true,
            start_video_off: false,
            start_audio_off: false,
            lang: "pt",
            enable_knocking: false,
            enable_prejoin_ui: true,
            enable_network_ui: true,
            enable_people_ui: true,
            eject_at_room_exp: true,
          },
        }),
      });

      if (!roomResponse.ok) {
        const errorText = await roomResponse.text();
        console.error("Failed to create room:", errorText);
        
        // If room already exists, try to get it
        if (roomResponse.status === 400 && errorText.includes("already exists")) {
          const getResponse = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
            headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
          });
          
          if (getResponse.ok) {
            const existingRoom = await getResponse.json();
            const roomUrl = existingRoom.url;
            
            // Update session with room URL
            await supabase
              .from("mentoring_sessions")
              .update({ meeting_url: roomUrl })
              .eq("id", session_id);

            // Create token
            const tokenResponse = await fetch("https://api.daily.co/v1/meeting-tokens", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${DAILY_API_KEY}`,
              },
              body: JSON.stringify({
                properties: {
                  room_name: roomName,
                  user_name: isMentor ? mentorInfo?.name : "Mentee",
                  is_owner: isMentor,
                  enable_screenshare: true,
                  exp: Math.floor(Date.now() / 1000) + (session.duration_minutes + 30) * 60,
                },
              }),
            });

            const tokenData = await tokenResponse.json();

            return new Response(
              JSON.stringify({
                room_url: roomUrl,
                token: tokenData.token,
                is_owner: isMentor,
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
        
        return new Response(
          JSON.stringify({ error: "Failed to create meeting room" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const roomData = await roomResponse.json();
      const roomUrl = roomData.url;

      console.log("Room created:", roomUrl);

      // Update session with room URL
      const { error: updateError } = await supabase
        .from("mentoring_sessions")
        .update({ meeting_url: roomUrl })
        .eq("id", session_id);

      if (updateError) {
        console.error("Failed to update session:", updateError);
      }

      // Create meeting token
      const tokenResponse = await fetch("https://api.daily.co/v1/meeting-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            user_name: isMentor ? mentorInfo?.name : "Mentee",
            is_owner: isMentor,
            enable_screenshare: true,
            exp: Math.floor(Date.now() / 1000) + (session.duration_minutes + 30) * 60,
          },
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Failed to create token:", errorText);
        return new Response(
          JSON.stringify({ error: "Failed to create meeting token" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const tokenData = await tokenResponse.json();

      return new Response(
        JSON.stringify({
          room_url: roomUrl,
          token: tokenData.token,
          is_owner: isMentor,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
