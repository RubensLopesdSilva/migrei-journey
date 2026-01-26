import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  redirectTo: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectTo }: PasswordResetRequest = await req.json();

    console.log("Generating password reset link for:", email);
    console.log("Redirect to:", redirectTo);

    // Validate required fields
    if (!email || !redirectTo) {
      throw new Error("Missing required fields: email and redirectTo");
    }

    // Create Supabase admin client to generate the recovery link
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Generate the recovery link using admin API
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: redirectTo,
      },
    });

    if (linkError) {
      console.error("Error generating recovery link:", linkError);
      throw new Error(`Failed to generate recovery link: ${linkError.message}`);
    }

    if (!linkData?.properties?.action_link) {
      throw new Error("No recovery link generated");
    }

    const resetUrl = linkData.properties.action_link;
    console.log("Generated reset URL successfully");

    const emailResponse = await resend.emails.send({
      from: "Migrei <noreply@migrei.org>",
      to: [email],
      subject: "Redefinir sua senha - Migrei",
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir Senha - Migrei</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 48px 24px;">
                <table role="presentation" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px -10px rgba(13, 59, 76, 0.15);">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: linear-gradient(145deg, #0D3B4C 0%, #0F5F5C 60%, #0F766E 100%); padding: 40px 48px 36px; text-align: center;">
                      <img src="https://migrei-compass.lovable.app/images/logo-migrei-white.png" alt="Migrei" style="height: 44px; width: auto; display: inline-block;" />
                    </td>
                  </tr>
                  
                  <!-- Icon Section -->
                  <tr>
                    <td style="padding: 40px 48px 0; text-align: center;">
                      <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(145deg, #E6F7F5 0%, #D1FAE5 100%); border-radius: 16px; line-height: 64px; margin-bottom: 24px;">
                        <span style="font-size: 28px;">🔐</span>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 48px 40px;">
                      <h1 style="margin: 0 0 16px; color: #0D3B4C; font-size: 26px; font-weight: 700; text-align: center; letter-spacing: -0.5px;">
                        Redefinir sua senha
                      </h1>
                      <p style="margin: 0 0 32px; color: #64748b; font-size: 16px; line-height: 1.7; text-align: center;">
                        Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha segura.
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="text-align: center; padding: 0 0 32px;">
                            <a href="${resetUrl}" 
                               style="display: inline-block; background: linear-gradient(145deg, #0F766E 0%, #14B8A6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 8px 24px -4px rgba(15, 118, 110, 0.45); letter-spacing: 0.3px;">
                              Redefinir Senha
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Info Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="background-color: #F8FAFC; border-radius: 12px; padding: 20px 24px; border: 1px solid #E2E8F0;">
                            <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6; text-align: center;">
                              ⏱️ Este link expira em <strong style="color: #0D3B4C;">1 hora</strong><br>
                              <span style="color: #94a3b8; font-size: 13px;">Se você não solicitou esta redefinição, ignore este email.</span>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Divider -->
                  <tr>
                    <td style="padding: 0 48px;">
                      <div style="border-top: 1px solid #E2E8F0;"></div>
                    </td>
                  </tr>
                  
                  <!-- Fallback Link -->
                  <tr>
                    <td style="padding: 24px 48px 32px;">
                      <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6; text-align: center;">
                        Se o botão não funcionar, copie e cole este link:<br>
                        <a href="${resetUrl}" style="color: #0F766E; word-break: break-all; font-size: 11px;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%); padding: 28px 48px; text-align: center; border-top: 1px solid #E2E8F0;">
                      <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 500;">
                        Migrei
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                        Sua jornada de transição profissional
                      </p>
                      <p style="margin: 16px 0 0; color: #cbd5e1; font-size: 11px;">
                        © ${new Date().getFullYear()} Migrei. Todos os direitos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
