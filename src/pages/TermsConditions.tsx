import { SEOHead, SEOBreadcrumbs } from "@/components/seo";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale, Ban, RefreshCw } from "lucide-react";

const TermsConditions = () => {
  const lastUpdated = "20 de Janeiro de 2026";

  const sections = [
    {
      icon: FileText,
      title: "1. Aceitação dos Termos",
      content: [
        {
          subtitle: "1.1 Acordo Vinculante",
          text: "Ao acessar ou utilizar a plataforma Migrei, você concorda em cumprir e estar vinculado a estes Termos e Condições. Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços."
        },
        {
          subtitle: "1.2 Capacidade Legal",
          text: "Você declara ter pelo menos 18 anos de idade e possuir capacidade legal para celebrar este acordo. Ao utilizar a plataforma, você confirma que possui autoridade para vincular-se a estes termos."
        },
        {
          subtitle: "1.3 Alterações nos Termos",
          text: "Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos sobre mudanças significativas através de e-mail ou aviso na plataforma. O uso continuado após alterações constitui aceitação dos novos termos."
        }
      ]
    },
    {
      icon: Users,
      title: "2. Descrição do Serviço",
      content: [
        {
          subtitle: "2.1 O que é o Migrei",
          text: "O Migrei é uma plataforma digital de transição de carreira que oferece: metodologia estruturada em 6 fases (Despertar, Descobrir, Decidir, Desenvolver, Deslanchar, Desfrutar), coach de inteligência artificial para orientação personalizada, networking com profissionais em transição, ferramentas de autoconhecimento e planejamento, e acesso a mentores especializados."
        },
        {
          subtitle: "2.2 Natureza do Serviço",
          text: "O Migrei oferece ferramentas e orientações para auxiliar sua transição de carreira. Não garantimos resultados específicos como emprego, aumento salarial ou sucesso profissional, pois estes dependem de múltiplos fatores incluindo esforço individual, condições de mercado e circunstâncias pessoais."
        },
        {
          subtitle: "2.3 Disponibilidade",
          text: "Nos esforçamos para manter a plataforma disponível 24/7, mas não garantimos acesso ininterrupto. Podemos realizar manutenções programadas ou emergenciais que podem afetar temporariamente o acesso."
        }
      ]
    },
    {
      icon: Shield,
      title: "3. Conta do Usuário",
      content: [
        {
          subtitle: "3.1 Registro",
          text: "Para utilizar a plataforma, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de suas credenciais de acesso."
        },
        {
          subtitle: "3.2 Responsabilidade da Conta",
          text: "Você é integralmente responsável por todas as atividades realizadas em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado ou violação de segurança."
        },
        {
          subtitle: "3.3 Uma Conta por Pessoa",
          text: "Cada pessoa física pode manter apenas uma conta ativa. Contas duplicadas podem ser encerradas sem aviso prévio."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "4. Planos e Pagamentos",
      content: [
        {
          subtitle: "4.1 Planos Disponíveis",
          text: "Oferecemos diferentes planos de assinatura: Plano Gratuito com acesso limitado a recursos básicos, e Planos Premium com acesso completo a todas as funcionalidades, incluindo coach de IA ilimitado, mentorias e networking exclusivo."
        },
        {
          subtitle: "4.2 Cobrança",
          text: "As assinaturas premium são cobradas de forma recorrente (mensal ou anual) através do Stripe. O valor será debitado automaticamente no método de pagamento cadastrado na data de renovação."
        },
        {
          subtitle: "4.3 Cancelamento",
          text: "Você pode cancelar sua assinatura a qualquer momento através das configurações da conta. O cancelamento será efetivo ao final do período já pago, mantendo o acesso até essa data."
        },
        {
          subtitle: "4.4 Reembolso",
          text: "Oferecemos garantia de 7 dias para novas assinaturas. Se não estiver satisfeito, solicite reembolso integral dentro deste período através das configurações da sua conta. Após este prazo, não realizamos reembolsos proporcionais."
        },
        {
          subtitle: "4.5 Alteração de Preços",
          text: "Podemos alterar os preços dos planos com aviso prévio de 30 dias. Assinantes ativos serão notificados e poderão cancelar antes da aplicação do novo valor."
        }
      ]
    },
    {
      icon: Ban,
      title: "5. Uso Aceitável",
      content: [
        {
          subtitle: "5.1 Condutas Proibidas",
          text: "Você concorda em NÃO: compartilhar credenciais de acesso com terceiros, utilizar a plataforma para fins ilegais ou fraudulentos, publicar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros, tentar acessar áreas restritas ou sistemas não autorizados, utilizar bots, scrapers ou automações não autorizadas, revender ou redistribuir conteúdo da plataforma."
        },
        {
          subtitle: "5.2 Conteúdo do Networking",
          text: "Ao participar do networking, você é responsável pelo conteúdo que publica. Reservamo-nos o direito de remover conteúdo que viole estes termos ou nossas diretrizes."
        },
        {
          subtitle: "5.3 Interação com IA",
          text: "O coach de IA fornece orientações gerais baseadas nas informações fornecidas. Não substitui aconselhamento profissional especializado (psicológico, jurídico, financeiro). Decisões tomadas com base nas orientações são de sua responsabilidade."
        }
      ]
    },
    {
      icon: Scale,
      title: "6. Propriedade Intelectual",
      content: [
        {
          subtitle: "6.1 Direitos do Migrei",
          text: "Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, metodologia, software e design, é propriedade do Migrei ou de seus licenciadores e está protegido por leis de propriedade intelectual."
        },
        {
          subtitle: "6.2 Licença de Uso",
          text: "Concedemos a você uma licença limitada, não exclusiva, não transferível e revogável para acessar e utilizar a plataforma para fins pessoais e não comerciais, conforme seu plano de assinatura."
        },
        {
          subtitle: "6.3 Seu Conteúdo",
          text: "Você mantém a propriedade do conteúdo que cria na plataforma (textos, respostas, posts). Ao publicar, você nos concede licença para exibir, armazenar e processar esse conteúdo conforme necessário para operar o serviço."
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: "7. Limitação de Responsabilidade",
      content: [
        {
          subtitle: "7.1 Isenção de Garantias",
          text: "A plataforma é fornecida 'como está'. Não garantimos que o serviço será ininterrupto, livre de erros ou que atenderá suas expectativas específicas. Não nos responsabilizamos por decisões de carreira tomadas com base no uso da plataforma."
        },
        {
          subtitle: "7.2 Limitação de Danos",
          text: "Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais ou consequenciais. Nossa responsabilidade total está limitada ao valor pago por você nos últimos 12 meses de assinatura."
        },
        {
          subtitle: "7.3 Terceiros",
          text: "Não nos responsabilizamos por serviços de terceiros acessados através da plataforma, incluindo mentores independentes, links externos ou integrações."
        }
      ]
    },
    {
      icon: RefreshCw,
      title: "8. Suspensão e Encerramento",
      content: [
        {
          subtitle: "8.1 Por Você",
          text: "Você pode encerrar sua conta a qualquer momento através das configurações. Seus dados serão tratados conforme nossa Política de Privacidade."
        },
        {
          subtitle: "8.2 Por Nós",
          text: "Podemos suspender ou encerrar sua conta imediatamente se: você violar estes termos, utilizar a plataforma de forma prejudicial a outros usuários, não efetuar pagamentos devidos, ou por determinação legal."
        },
        {
          subtitle: "8.3 Efeitos do Encerramento",
          text: "Após o encerramento, você perde acesso à plataforma e todo conteúdo associado. Não somos obrigados a manter ou fornecer cópias do seu conteúdo após o encerramento."
        }
      ]
    },
    {
      icon: Scale,
      title: "9. Disposições Gerais",
      content: [
        {
          subtitle: "9.1 Lei Aplicável",
          text: "Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao foro da comarca de São Paulo, SP."
        },
        {
          subtitle: "9.2 Acordo Integral",
          text: "Estes Termos, juntamente com a Política de Privacidade, constituem o acordo integral entre você e o Migrei, substituindo quaisquer acordos anteriores."
        },
        {
          subtitle: "9.3 Cessão",
          text: "Você não pode ceder ou transferir seus direitos sob estes termos. Podemos ceder nossos direitos e obrigações a terceiros em caso de fusão, aquisição ou venda de ativos."
        },
        {
          subtitle: "9.4 Renúncia",
          text: "A falha em exercer qualquer direito previsto nestes termos não constitui renúncia a esse direito."
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="Termos e Condições | Migrei"
        description="Leia os termos e condições de uso da plataforma Migrei. Regras de utilização, direitos e responsabilidades."
        canonical="https://migrei.com/termos"
        noIndex={false}
      />
      <SEOBreadcrumbs
        items={[
          { name: "Início", url: "https://migrei.com" },
          { name: "Termos e Condições", url: "https://migrei.com/termos" }
        ]}
      />
      
      <div className="min-h-screen bg-background">
        <LandingHeader />
        
        <main className="container mx-auto px-4 py-12 md:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Termos e Condições
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leia atentamente os termos que regem o uso da plataforma Migrei. 
              Ao utilizar nossos serviços, você concorda com estas condições.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Última atualização: {lastUpdated}
            </p>
          </div>

          {/* Intro Card */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <p className="text-foreground">
                Bem-vindo ao <strong>Migrei</strong>! Estes Termos e Condições ("Termos") estabelecem 
                as regras e diretrizes para uso de nossa plataforma de transição de carreira, 
                disponível em <strong>migrei.com</strong>. O Migrei é operado por nossa equipe 
                ("nós", "nosso" ou "Migrei") e estes termos constituem um acordo legal entre você 
                ("usuário", "você") e o Migrei.
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


          {/* Related Links */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Documentos Relacionados
              </h2>
              <p className="text-muted-foreground mb-4">
                Consulte também nossa Política de Privacidade para entender como 
                tratamos seus dados pessoais:
              </p>
              <a 
                href="/privacidade" 
                className="text-primary hover:underline font-medium"
              >
                Política de Privacidade →
              </a>
            </CardContent>
          </Card>
        </main>
        
        <LandingFooter />
      </div>
    </>
  );
};

export default TermsConditions;
