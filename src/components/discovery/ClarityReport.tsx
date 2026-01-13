import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  Heart, 
  Target, 
  Star,
  TrendingUp,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function ClarityReport() {
  const { clarityReport, generateClarityReport, phaseProgress } = useDiscovery();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await generateClarityReport();
    setIsGenerating(false);
  };

  if (!clarityReport) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Relatório de Clareza Profissional</h2>
          <p className="text-muted-foreground">
            O output final da Fase 2: quem você é e para onde vai
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            
            {phaseProgress < 60 ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Complete mais atividades</h3>
                  <p className="text-muted-foreground">
                    Para gerar seu Relatório de Clareza, complete pelo menos 60% da fase.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${phaseProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{phaseProgress}%</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pronto para gerar!</h3>
                  <p className="text-muted-foreground">
                    Você completou atividades suficientes. Gere seu relatório agora.
                  </p>
                </div>
                <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                  {isGenerating ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gerando...</>
                  ) : (
                    <><FileText className="h-4 w-4 mr-2" /> Gerar Relatório</>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Badge className="mb-2">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Relatório Gerado
        </Badge>
        <h2 className="text-2xl font-bold">Seu Relatório de Clareza Profissional</h2>
        <p className="text-muted-foreground">
          Gerado em {new Date(clarityReport.generated_at).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Professional Identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Quem Sou Eu Profissionalmente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {clarityReport.professional_identity}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Motivators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                O Que Me Motiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(clarityReport.core_motivators as string[]).map((motivator, i) => (
                  <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                    {motivator}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Competencies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Minhas Top Competências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(clarityReport.top_competencies as string[]).map((comp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Areas to Develop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Áreas para Desenvolver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(clarityReport.areas_to_develop as string[]).map((area, i) => (
                  <Badge key={i} variant="outline" className="text-sm py-1 px-3">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommended Routes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Rotas Profissionais Recomendadas
            </CardTitle>
            <CardDescription>
              2-3 caminhos que fazem sentido para você seguir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {(clarityReport.recommended_routes as Array<{ route_name: string; description: string; next_steps: string[] }>).map((route, i) => (
                <Card key={i} className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit mb-2">Rota {i + 1}</Badge>
                    <CardTitle className="text-base">{route.route_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{route.description}</p>
                    <div>
                      <p className="text-xs font-medium mb-2">Próximos passos:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {route.next_steps?.map((step, j) => (
                          <li key={j} className="flex items-start gap-1">
                            <span className="text-primary">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          Regenerar Relatório
        </Button>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Baixar PDF
        </Button>
      </div>
    </div>
  );
}
