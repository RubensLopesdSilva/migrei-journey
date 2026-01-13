import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useDiscovery } from '@/hooks/useDiscovery';
import { motion, AnimatePresence } from 'framer-motion';

export function ProfessionRecommendations() {
  const { 
    recommendations, 
    generateRecommendations, 
    selectProfession, 
    isGeneratingRecommendations,
    diagnosticResults,
    careerWheel,
    competencies,
  } = useDiscovery();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  // Check if user has enough data to generate recommendations
  const hasEnoughData = diagnosticResults.length >= 2 && careerWheel.length >= 3 && competencies.length >= 5;

  const toggleCompare = (id: string) => {
    setComparingIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const comparingProfessions = recommendations.filter(r => comparingIds.includes(r.id));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Motor de Recomendações de Profissões</h2>
        <p className="text-muted-foreground">
          Profissões compatíveis com seu perfil, analisadas por IA
        </p>
      </div>

      {/* Generate Button */}
      {!hasEnoughData ? (
        <Card className="border-dashed border-orange-500/50">
          <CardContent className="py-6 text-center">
            <AlertCircle className="h-10 w-10 text-orange-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Complete mais etapas primeiro</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Para gerar recomendações precisas, complete pelo menos:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 2 diagnósticos ({diagnosticResults.length}/2 ✓)</li>
              <li>• 3 dimensões da roda da carreira ({careerWheel.length}/3 ✓)</li>
              <li>• 5 competências avaliadas ({competencies.length}/5 ✓)</li>
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Análise de Perfil Completa</h3>
                  <p className="text-sm text-muted-foreground">
                    Gere recomendações personalizadas baseadas em todo seu perfil
                  </p>
                </div>
              </div>
              <Button
                onClick={generateRecommendations}
                disabled={isGeneratingRecommendations}
                size="lg"
              >
                {isGeneratingRecommendations ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analisando...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> {recommendations.length > 0 ? 'Atualizar' : 'Gerar'} Recomendações</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparator */}
      {comparingIds.length > 1 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Comparador de Profissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparingIds.length}, 1fr)` }}>
              {comparingProfessions.map(prof => (
                <div key={prof.id} className="space-y-3">
                  <h4 className="font-semibold text-center">{prof.profession_name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Match:</span>
                      <Badge>{prof.match_score}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Salário:</span>
                      <span className="text-muted-foreground">{prof.salary_range}</span>
                    </div>
                    <div>
                      <span>Gap de Skills:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(prof.skills_gap as string[]).slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setComparingIds([])}
            >
              Limpar Comparação
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recommendations List */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {recommendations.length} Profissões Recomendadas
            </h3>
            {comparingIds.length > 0 && (
              <Badge variant="secondary">{comparingIds.length}/3 selecionadas para comparar</Badge>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((prof, index) => {
              const isExpanded = expandedId === prof.id;
              const isSelected = prof.is_selected;
              const isComparing = comparingIds.includes(prof.id);

              return (
                <motion.div
                  key={prof.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''} ${isComparing ? 'border-blue-500' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                          <div>
                            <CardTitle className="text-base">{prof.profession_name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={prof.match_score} className="w-20 h-2" />
                              <span className="text-sm font-medium">{prof.match_score}%</span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge className="bg-primary">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Selecionada
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {prof.profession_description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>{prof.salary_range}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="truncate max-w-[150px]">{prof.growth_outlook}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-3 pt-3 border-t"
                          >
                            <div>
                              <p className="text-xs font-medium mb-1">Por que combina com você:</p>
                              <div className="flex flex-wrap gap-1">
                                {(prof.match_reasons as string[]).map((reason, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{reason}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium mb-1 text-green-600">
                                <CheckCircle2 className="h-3 w-3 inline mr-1" />
                                Suas habilidades que já tem:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {(prof.user_matching_skills as string[]).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="text-xs border-green-500 text-green-700">{skill}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium mb-1 text-orange-600">
                                <Target className="h-3 w-3 inline mr-1" />
                                Habilidades a desenvolver:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {(prof.skills_gap as string[]).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="text-xs border-orange-500 text-orange-700">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={() => setExpandedId(isExpanded ? null : prof.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                          {isExpanded ? 'Menos' : 'Mais'}
                        </Button>
                        <Button
                          variant={isComparing ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => toggleCompare(prof.id)}
                        >
                          {isComparing ? 'Comparando' : 'Comparar'}
                        </Button>
                        <Button
                          variant={isSelected ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => selectProfession(prof.id)}
                        >
                          {isSelected ? 'Selecionada' : 'Selecionar'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {recommendations.length === 0 && hasEnoughData && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Clique em "Gerar Recomendações" para descobrir profissões compatíveis com seu perfil.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
