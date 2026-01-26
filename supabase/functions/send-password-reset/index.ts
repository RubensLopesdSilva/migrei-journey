import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl }: PasswordResetRequest = await req.json();

    console.log("Sending password reset email to:", email);
    console.log("Reset URL:", resetUrl);

    // Validate required fields
    if (!email || !resetUrl) {
      throw new Error("Missing required fields: email and resetUrl");
    }

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
          <title>Redefinir Senha</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0;">
                <table role="presentation" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0D3B4C 0%, #145566 50%, #0F766E 100%); padding: 32px 40px; text-align: center;">
                      <img src="https://migrei-compass.lovable.app/lovable-uploads/dfb4152f-5ee8-460f-b92f-b4276968713b.png" alt="Migrei" style="height: 48px; width: auto;" />
                      <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                        Sua jornada de transição profissional
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 16px; color: #0D3B4C; font-size: 22px; font-weight: 600;">
                        Redefinir sua senha
                      </h2>
                      <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
                        Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="text-align: center; padding: 8px 0 32px;">
                            <a href="${resetUrl}" 
                               style="display: inline-block; background: linear-gradient(135deg, #0F766E 0%, #14B8A6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px 0 rgba(20, 184, 166, 0.4);">
                              Redefinir Senha
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 16px; color: #71717a; font-size: 14px; line-height: 1.6;">
                        Este link expira em <strong style="color: #0D3B4C;">1 hora</strong>. Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.
                      </p>
                      
                      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">
                      
                      <p style="margin: 0; color: #a1a1aa; font-size: 12px; line-height: 1.5;">
                        Se o botão não funcionar, copie e cole este link no seu navegador:<br>
                        <a href="${resetUrl}" style="color: #0F766E; word-break: break-all;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
                      <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
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
