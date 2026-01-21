import { SEOHead, SEOBreadcrumbs } from "@/components/seo";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Database, Lock, Eye, UserCheck, Mail, Globe, Clock } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "20 de Janeiro de 2026";

  const sections = [
    {
      icon: Database,
      title: "1. Dados que Coletamos",
      content: [
        {
          subtitle: "1.1 Dados de Cadastro",
          text: "Ao criar sua conta, coletamos: nome completo, endereço de e-mail, senha (armazenada de forma criptografada) e, opcionalmente, foto de perfil e informações profissionais como cargo atual, área de atuação e anos de experiência."
        },
        {
          subtitle: "1.2 Dados de Uso da Plataforma",
          text: "Durante sua jornada no Ciclo Migrei, coletamos: respostas aos diagnósticos e avaliações, progresso nas 6 fases (Despertar, Descobrir, Decidir, Desenvolver, Deslanchar, Desfrutar), interações com o coach de IA, conquistas e badges obtidos, e histórico de atividades."
        },
        {
          subtitle: "1.3 Dados de Networking",
          text: "Quando você participa do networking, coletamos: publicações, comentários e interações, conexões com outros usuários, participação em eventos e mentorias, e ofertas de ajuda (Give & Ask)."
        },
        {
          subtitle: "1.4 Dados de Pagamento",
          text: "Para assinantes premium, processamos pagamentos através do Stripe. Não armazenamos dados completos de cartão de crédito em nossos servidores - apenas referências seguras fornecidas pelo processador de pagamento."
        },
        {
          subtitle: "1.5 Dados Técnicos",
          text: "Coletamos automaticamente: endereço IP, tipo de navegador e dispositivo, páginas visitadas e tempo de permanência, e cookies essenciais para funcionamento da plataforma."
        }
      ]
    },
    {
      icon: Eye,
      title: "2. Como Utilizamos seus Dados",
      content: [
        {
          subtitle: "2.1 Personalização da Experiência",
          text: "Utilizamos seus dados para personalizar recomendações de carreira, adaptar o conteúdo do coach de IA ao seu perfil, sugerir conexões relevantes no networking, e gerar relatórios de clareza e progresso personalizados."
        },
        {
          subtitle: "2.2 Melhoria do Serviço",
          text: "Analisamos dados agregados e anonimizados para melhorar algoritmos de recomendação, desenvolver novos recursos e ferramentas, identificar e corrigir problemas técnicos, e medir eficácia das metodologias."
        },
        {
          subtitle: "2.3 Comunicação",
          text: "Enviamos e-mails sobre: atualizações importantes da conta, lembretes de atividades pendentes (opcional), novidades e recursos da plataforma (opcional), e confirmações de transações e pagamentos."
        }
      ]
    },
    {
      icon: Lock,
      title: "3. Proteção e Segurança",
      content: [
        {
          subtitle: "3.1 Medidas de Segurança",
          text: "Implementamos: criptografia SSL/TLS em todas as comunicações, senhas armazenadas com hash seguro (bcrypt), autenticação segura via Supabase Auth, políticas de segurança em nível de linha (RLS) no banco de dados, e backups regulares com recuperação de desastres."
        },
        {
          subtitle: "3.2 Acesso Restrito",
          text: "Apenas funcionários autorizados têm acesso aos dados pessoais, e somente quando necessário para suporte ou operação do serviço. Todo acesso é registrado e auditado."
        },
        {
          subtitle: "3.3 Inteligência Artificial",
          text: "As conversas com o coach de IA são processadas de forma segura. Utilizamos modelos de IA para fornecer orientações personalizadas, mas não compartilhamos suas informações pessoais com terceiros para treinamento de modelos."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "4. Seus Direitos (LGPD)",
      content: [
        {
          subtitle: "4.1 Direitos Garantidos",
          text: "Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: confirmar a existência de tratamento de dados, acessar seus dados pessoais, corrigir dados incompletos ou desatualizados, solicitar anonimização ou bloqueio de dados desnecessários, solicitar portabilidade dos dados, solicitar eliminação dos dados, e revogar consentimento a qualquer momento."
        },
        {
          subtitle: "4.2 Como Exercer seus Direitos",
          text: "Para exercer qualquer direito, entre em contato através do e-mail contato@migrei.com ou através das configurações da sua conta na plataforma. Responderemos em até 15 dias úteis."
        }
      ]
    },
    {
      icon: Globe,
      title: "5. Compartilhamento de Dados",
      content: [
        {
          subtitle: "5.1 Terceiros Essenciais",
          text: "Compartilhamos dados apenas com: Stripe (processamento de pagamentos), provedores de infraestrutura em nuvem (hospedagem segura), e serviços de e-mail transacional."
        },
        {
          subtitle: "5.2 Networking",
          text: "Informações que você escolhe compartilhar no networking (posts, perfil público) são visíveis para outros membros. Você controla o que compartilha através das configurações de privacidade."
        },
        {
          subtitle: "5.3 Mentorias",
          text: "Ao agendar mentorias, compartilhamos informações básicas do seu perfil com o mentor selecionado para facilitar a sessão."
        },
        {
          subtitle: "5.4 Requisitos Legais",
          text: "Podemos divulgar dados quando exigido por lei, ordem judicial ou autoridade governamental competente."
        }
      ]
    },
    {
      icon: Clock,
      title: "6. Retenção de Dados",
      content: [
        {
          subtitle: "6.1 Conta Ativa",
          text: "Mantemos seus dados enquanto sua conta estiver ativa e você utilizar nossos serviços."
        },
        {
          subtitle: "6.2 Exclusão de Conta",
          text: "Ao solicitar exclusão da conta, removemos seus dados pessoais em até 30 dias, exceto dados necessários para obrigações legais ou contratuais."
        },
        {
          subtitle: "6.3 Dados Anonimizados",
          text: "Dados agregados e anonimizados podem ser mantidos indefinidamente para análises estatísticas e melhoria do serviço."
        }
      ]
    },
    {
      icon: Mail,
      title: "7. Cookies e Tecnologias",
      content: [
        {
          subtitle: "7.1 Cookies Essenciais",
          text: "Utilizamos cookies necessários para: autenticação e segurança da sessão, preferências de idioma e tema, e funcionamento básico da plataforma."
        },
        {
          subtitle: "7.2 Cookies Analíticos",
          text: "Com seu consentimento, utilizamos cookies para: análise de uso e navegação, e melhoria da experiência do usuário."
        }
      ]
    },
    {
      icon: Shield,
      title: "8. Menores de Idade",
      content: [
        {
          subtitle: "8.1 Restrição de Idade",
          text: "O Migrei é destinado a maiores de 18 anos. Não coletamos intencionalmente dados de menores. Se identificarmos dados de menores, serão excluídos imediatamente."
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="Política de Privacidade | Migrei"
        description="Conheça como o Migrei protege seus dados pessoais. Política de privacidade em conformidade com a LGPD."
        canonical="https://migrei.com/privacidade"
        noIndex={false}
      />
      <SEOBreadcrumbs
        items={[
          { name: "Início", url: "https://migrei.com" },
          { name: "Política de Privacidade", url: "https://migrei.com/privacidade" }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <LandingHeader />
        
        <main className="container mx-auto px-4 py-12 md:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sua privacidade é fundamental para nós. Esta política explica como coletamos, 
              usamos e protegemos seus dados pessoais na plataforma Migrei.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Última atualização: {lastUpdated}
            </p>
          </div>

          {/* Intro Card */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <p className="text-foreground">
                O <strong>Migrei</strong> ("nós", "nosso" ou "plataforma") é uma plataforma de transição 
                de carreira que utiliza metodologia estruturada em 6 fases, inteligência artificial e 
                networking para ajudar profissionais em sua jornada. Esta Política de Privacidade 
                descreve nossas práticas em relação aos dados pessoais que coletamos através de 
                nossa plataforma disponível em <strong>migrei.com</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 p-6 border-b bg-muted/30">
                    <section.icon className="w-6 h-6 text-primary flex-shrink-0" />
                    <h2 className="text-xl font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <div className="p-6 space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="font-medium text-foreground mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="mt-8 border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                9. Contato e Dúvidas
              </h2>
              <p className="text-muted-foreground mb-4">
                Para questões sobre esta política, exercício de direitos ou qualquer dúvida 
                relacionada à privacidade, entre em contato:
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground">
                  <strong>E-mail:</strong>{" "}
                  <a 
                    href="mailto:contato@migrei.com" 
                    className="text-primary hover:underline"
                  >
                    contato@migrei.com
                  </a>
                </p>
                <p className="text-foreground mt-2">
                  <strong>Encarregado de Dados (DPO):</strong> Equipe Migrei
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates Notice */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                10. Alterações nesta Política
              </h2>
              <p className="text-muted-foreground">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                sobre mudanças significativas através de e-mail ou aviso na plataforma. 
                Recomendamos revisar esta página regularmente. O uso continuado da plataforma 
                após alterações constitui aceitação da política atualizada.
              </p>
            </CardContent>
          </Card>
        </main>
        
        <LandingFooter />
      </div>
    </>
  );
};

export default PrivacyPolicy;
