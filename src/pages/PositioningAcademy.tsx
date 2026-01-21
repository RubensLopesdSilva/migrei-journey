import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { SEOHead } from '@/components/seo';
import { WeeklyMission } from '@/components/positioning/WeeklyMission';
import { NetworkingPillars } from '@/components/positioning/NetworkingPillars';
import { MyPitch } from '@/components/positioning/MyPitch';
import { AchievementsWall } from '@/components/positioning/AchievementsWall';
import { WeeklyChallenges } from '@/components/positioning/WeeklyChallenges';
import { ScriptViewer } from '@/components/positioning/ScriptViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';
import { Users, Crown, Sparkles, MessageSquare, Target, Zap, Lock } from 'lucide-react';

type PillarType = 'digital' | 'presencial' | 'onetoone';

const PositioningAcademy = () => {
  const navigate = useNavigate();
  const { planSlug, isLoading } = useSubscription();
  const [scriptModal, setScriptModal] = useState<{
    open: boolean;
    pillarId: PillarType;
    scriptIndex: number;
  }>({ open: false, pillarId: 'digital', scriptIndex: 0 });

  // Track completed challenges count - starts with 1 because one is already complete in mock data
  const [completedChallenges, setCompletedChallenges] = useState(1);

  const isFreePlan = planSlug === "free" || !planSlug;

  const handleSelectScript = (pillarId: PillarType, scriptIndex: number) => {
    setScriptModal({ open: true, pillarId, scriptIndex });
  };

  const handleUpgrade = () => {
    navigate("/configuracoes");
  };

  // Preview features for free users
  const previewFeatures = [
    {
      icon: MessageSquare,
      title: "Scripts de Abordagem",
      description: "Modelos prontos para LinkedIn, eventos e conversas 1:1"
    },
    {
      icon: Target,
      title: "Desafios Semanais",
      description: "Metas práticas para expandir sua rede profissional"
    },
    {
      icon: Users,
      title: "Meu Pitch",
      description: "Construa e refine sua apresentação profissional"
    },
    {
      icon: Sparkles,
      title: "Conquistas",
      description: "Acompanhe seu progresso e celebre suas vitórias"
    }
  ];

  return (
    <>
      <SEOHead
        title="Networking para Transição de Carreira | Migrei"
        description="Construa conexões estratégicas com scripts prontos, desafios semanais e pilares de networking para impulsionar sua transição."
        canonical="https://migrei.com/networking"
        noIndex={true}
      />
      <PageLayout>
        <PageContent>
          <PageBreadcrumb
            items={[{ label: "Networking", current: true }]}
            className="mb-4"
          />

          {/* Hero Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  Networking
                </h1>
                <p className="text-sm text-muted-foreground">
                  Construa conexões que abrem portas
                </p>
              </div>
              {isFreePlan && (
                <Badge variant="secondary" className="gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <Lock className="h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
          </div>

          {/* Free Plan - Locked State */}
          {isFreePlan ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Hero CTA Card */}
              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
                <CardContent className="p-8 relative">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-xl shadow-primary/25">
                        <Crown className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-center lg:text-left">
                      <h2 className="text-2xl font-bold mb-2">
                        Desbloqueie o Networking Profissional
                      </h2>
                      <p className="text-muted-foreground max-w-xl">
                        Com os planos Essential ou Premium, você terá acesso a scripts de abordagem, 
                        desafios semanais, ferramentas de pitch e muito mais para impulsionar sua rede de contatos.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Button 
                        onClick={handleUpgrade}
                        size="lg"
                        className="gap-2 btn-primary-gradient shadow-lg text-base px-8"
                      >
                        <Zap className="h-5 w-5" />
                        Fazer Upgrade
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Preview Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {previewFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-border/50 bg-card/50 hover:border-primary/20 transition-colors group relative overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <feature.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      {/* Lock overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <Button 
                          onClick={handleUpgrade}
                          size="sm"
                          variant="outline"
                          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Desbloquear
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Disponível nos planos Essential e Premium
                  </span>
                </div>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Networking é fundamental para uma transição de carreira bem-sucedida. 
                  Faça upgrade e comece a construir conexões estratégicas hoje.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            /* Paid Plans - Full Access */
            <>
              {/* Main Grid - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  {/* Weekly Mission */}
                  <WeeklyMission completedCount={completedChallenges} />

                  {/* Networking Pillars - Scripts */}
                  <NetworkingPillars onSelectScript={handleSelectScript} />

                  {/* Achievements Wall - Desktop only in main */}
                  <div className="hidden lg:block">
                    <AchievementsWall />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                  {/* My Pitch */}
                  <MyPitch />

                  {/* Weekly Challenges */}
                  <WeeklyChallenges onProgressChange={setCompletedChallenges} />

                  {/* Achievements Wall - Mobile/Tablet */}
                  <div className="lg:hidden">
                    <AchievementsWall />
                  </div>
                </div>
              </div>

              {/* Script Viewer Modal */}
              <ScriptViewer
                open={scriptModal.open}
                onOpenChange={(open) => setScriptModal(prev => ({ ...prev, open }))}
                pillarId={scriptModal.pillarId}
                scriptIndex={scriptModal.scriptIndex}
              />
            </>
          )}
        </PageContent>
      </PageLayout>
    </>
  );
};

export default PositioningAcademy;
