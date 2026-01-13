import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, StarOff, AlertCircle } from 'lucide-react';
import { DEFAULT_COMPETENCIES, CompetencyCategory } from '@/types/discovery';
import { useDiscovery } from '@/hooks/useDiscovery';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const categoryColors: Record<CompetencyCategory, string> = {
  technical: 'hsl(var(--primary))',
  behavioral: 'hsl(280, 70%, 60%)',
  leadership: 'hsl(45, 80%, 50%)',
  creative: 'hsl(160, 70%, 45%)',
};

const categoryLabels: Record<CompetencyCategory, string> = {
  technical: 'Técnicas',
  behavioral: 'Comportamentais',
  leadership: 'Liderança',
  creative: 'Criativas',
};

export function SkillsRadar() {
  const { competencies, saveCompetency } = useDiscovery();
  const [localRatings, setLocalRatings] = useState<Record<string, { rating: number; evidence: string; isStrength: boolean; isNeglected: boolean }>>({});
  const [activeCategory, setActiveCategory] = useState<CompetencyCategory | 'all'>('all');

  useEffect(() => {
    // Initialize from saved data or defaults
    const initial: Record<string, { rating: number; evidence: string; isStrength: boolean; isNeglected: boolean }> = {};
    DEFAULT_COMPETENCIES.forEach(comp => {
      const saved = competencies.find(c => c.competency_name === comp.name);
      initial[comp.name] = {
        rating: saved?.self_rating || 5,
        evidence: saved?.evidence || '',
        isStrength: saved?.is_top_strength || false,
        isNeglected: saved?.is_neglected || false,
      };
    });
    setLocalRatings(initial);
  }, [competencies]);

  const handleRatingChange = (name: string, rating: number) => {
    setLocalRatings(prev => ({
      ...prev,
      [name]: { ...prev[name], rating },
    }));
  };

  const handleSave = async (name: string, category: CompetencyCategory) => {
    const data = localRatings[name];
    if (data) {
      await saveCompetency(name, category, data.rating, data.evidence, data.isStrength, data.isNeglected);
    }
  };

  const toggleStrength = (name: string) => {
    setLocalRatings(prev => ({
      ...prev,
      [name]: { 
        ...prev[name], 
        isStrength: !prev[name]?.isStrength,
        isNeglected: false, // Can't be both
      },
    }));
  };

  const toggleNeglected = (name: string) => {
    setLocalRatings(prev => ({
      ...prev,
      [name]: { 
        ...prev[name], 
        isNeglected: !prev[name]?.isNeglected,
        isStrength: false, // Can't be both
      },
    }));
  };

  // Prepare radar chart data
  const radarData = DEFAULT_COMPETENCIES.map(comp => ({
    name: comp.name.length > 12 ? comp.name.substring(0, 12) + '...' : comp.name,
    fullName: comp.name,
    value: localRatings[comp.name]?.rating || 5,
    category: comp.category,
  }));

  const filteredCompetencies = activeCategory === 'all' 
    ? DEFAULT_COMPETENCIES 
    : DEFAULT_COMPETENCIES.filter(c => c.category === activeCategory);

  // Calculate top strengths and neglected
  const topStrengths = Object.entries(localRatings)
    .filter(([_, data]) => data.isStrength)
    .map(([name]) => name);

  const neglectedSkills = Object.entries(localRatings)
    .filter(([_, data]) => data.isNeglected)
    .map(([name]) => name);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Radar de Competências</h2>
        <p className="text-muted-foreground">
          Avalie suas competências e identifique forças e áreas de desenvolvimento
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
        >
          Todas
        </Button>
        {(Object.keys(categoryLabels) as CompetencyCategory[]).map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            style={{ borderColor: categoryColors[cat] }}
          >
            {categoryLabels[cat]}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 10]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <Radar
                name="Autoavaliação"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>

          {/* Summary */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 text-green-600" />
                Top 5 Forças
              </p>
              <div className="flex flex-wrap gap-1">
                {topStrengths.length > 0 ? (
                  topStrengths.slice(0, 5).map(s => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Marque suas forças abaixo</span>
                )}
              </div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                Negligenciadas
              </p>
              <div className="flex flex-wrap gap-1">
                {neglectedSkills.length > 0 ? (
                  neglectedSkills.map(s => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Nenhuma identificada</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Competency Sliders */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {filteredCompetencies.map(comp => {
            const data = localRatings[comp.name] || { rating: 5, evidence: '', isStrength: false, isNeglected: false };
            
            return (
              <Card 
                key={comp.name}
                className={`transition-all ${data.isStrength ? 'border-green-500/50 bg-green-500/5' : data.isNeglected ? 'border-orange-500/50 bg-orange-500/5' : ''}`}
                style={{ borderLeftColor: categoryColors[comp.category], borderLeftWidth: 3 }}
              >
                <CardContent className="py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{comp.name}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${data.isStrength ? 'text-green-600' : 'text-muted-foreground'}`}
                        onClick={() => {
                          toggleStrength(comp.name);
                          setTimeout(() => handleSave(comp.name, comp.category), 100);
                        }}
                        title="Marcar como força"
                      >
                        <Star className="h-4 w-4" fill={data.isStrength ? 'currentColor' : 'none'} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${data.isNeglected ? 'text-orange-600' : 'text-muted-foreground'}`}
                        onClick={() => {
                          toggleNeglected(comp.name);
                          setTimeout(() => handleSave(comp.name, comp.category), 100);
                        }}
                        title="Marcar como negligenciada"
                      >
                        <StarOff className="h-4 w-4" />
                      </Button>
                      <Badge variant="secondary" className="ml-2 min-w-[2rem] text-center">
                        {data.rating}
                      </Badge>
                    </div>
                  </div>
                  <Slider
                    value={[data.rating]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([v]) => handleRatingChange(comp.name, v)}
                    onValueCommit={() => handleSave(comp.name, comp.category)}
                  />
                  <Textarea
                    placeholder="Evidências ou exemplos..."
                    value={data.evidence}
                    onChange={(e) => setLocalRatings(prev => ({
                      ...prev,
                      [comp.name]: { ...prev[comp.name], evidence: e.target.value },
                    }))}
                    onBlur={() => handleSave(comp.name, comp.category)}
                    className="h-12 text-xs"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
