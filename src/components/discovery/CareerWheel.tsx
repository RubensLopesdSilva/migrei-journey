import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CAREER_WHEEL_DIMENSIONS } from '@/types/discovery';
import { useDiscovery } from '@/hooks/useDiscovery';
import { motion } from 'framer-motion';

const colors = [
  'hsl(var(--primary))',
  'hsl(280, 70%, 60%)',
  'hsl(200, 70%, 50%)',
  'hsl(160, 70%, 45%)',
  'hsl(45, 80%, 50%)',
];

export function CareerWheel() {
  const { careerWheel, saveCareerWheelAssessment } = useDiscovery();
  const [ratings, setRatings] = useState<Record<string, { current: number; desired: number; notes: string }>>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    // Initialize from saved data
    const initial: Record<string, { current: number; desired: number; notes: string }> = {};
    CAREER_WHEEL_DIMENSIONS.forEach(dim => {
      const saved = careerWheel.find(c => c.dimension === dim.key);
      initial[dim.key] = {
        current: saved?.current_rating || 5,
        desired: saved?.desired_rating || 8,
        notes: saved?.notes || '',
      };
    });
    setRatings(initial);
  }, [careerWheel]);

  const handleSave = async (dimension: string) => {
    const r = ratings[dimension];
    if (r) {
      await saveCareerWheelAssessment(dimension, r.current, r.desired, r.notes);
    }
  };

  const updateRating = (dimension: string, field: 'current' | 'desired', value: number) => {
    setRatings(prev => ({
      ...prev,
      [dimension]: { ...prev[dimension], [field]: value },
    }));
  };

  const updateNotes = (dimension: string, notes: string) => {
    setRatings(prev => ({
      ...prev,
      [dimension]: { ...prev[dimension], notes },
    }));
  };

  // SVG Radar Chart
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;

  const getPoint = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / CAREER_WHEEL_DIMENSIONS.length - Math.PI / 2;
    const radius = (value / 10) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const createPolygonPoints = (type: 'current' | 'desired') => {
    return CAREER_WHEEL_DIMENSIONS.map((dim, index) => {
      const value = ratings[dim.key]?.[type] || 5;
      const point = getPoint(index, value);
      return `${point.x},${point.y}`;
    }).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Roda da Carreira Migrei</h2>
        <p className="text-muted-foreground">
          Compare sua situação atual com seu desejado em cada dimensão
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card className="p-4">
          <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
            {/* Background circles */}
            {[2, 4, 6, 8, 10].map((level) => (
              <circle
                key={level}
                cx={centerX}
                cy={centerY}
                r={(level / 10) * maxRadius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}

            {/* Axis lines */}
            {CAREER_WHEEL_DIMENSIONS.map((_, index) => {
              const point = getPoint(index, 10);
              return (
                <line
                  key={index}
                  x1={centerX}
                  y1={centerY}
                  x2={point.x}
                  y2={point.y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            })}

            {/* Desired polygon (background) */}
            <motion.polygon
              points={createPolygonPoints('desired')}
              fill="hsl(var(--primary) / 0.2)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* Current polygon */}
            <motion.polygon
              points={createPolygonPoints('current')}
              fill="hsl(var(--primary) / 0.4)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* Labels */}
            {CAREER_WHEEL_DIMENSIONS.map((dim, index) => {
              const point = getPoint(index, 11.5);
              return (
                <text
                  key={dim.key}
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-foreground font-medium"
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  style={{ cursor: 'pointer' }}
                >
                  {dim.label}
                </text>
              );
            })}
          </svg>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/40" />
              <span className="text-sm">Atual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-primary border-dashed bg-primary/20" />
              <span className="text-sm">Desejado</span>
            </div>
          </div>
        </Card>

        {/* Dimension Controls */}
        <div className="space-y-4">
          {CAREER_WHEEL_DIMENSIONS.map((dim, index) => {
            const r = ratings[dim.key] || { current: 5, desired: 8, notes: '' };
            const gap = r.desired - r.current;
            
            return (
              <Card 
                key={dim.key}
                className={`transition-all ${activeIndex === index ? 'ring-2 ring-primary' : ''}`}
                style={{ borderLeftColor: colors[index], borderLeftWidth: 4 }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{dim.label}</CardTitle>
                    {gap > 3 && (
                      <Badge variant="destructive" className="text-xs">
                        Gap: {gap}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{dim.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Atual</span>
                      <span className="font-medium">{r.current}</span>
                    </div>
                    <Slider
                      value={[r.current]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([v]) => updateRating(dim.key, 'current', v)}
                      onValueCommit={() => handleSave(dim.key)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Desejado</span>
                      <span className="font-medium">{r.desired}</span>
                    </div>
                    <Slider
                      value={[r.desired]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([v]) => updateRating(dim.key, 'desired', v)}
                      onValueCommit={() => handleSave(dim.key)}
                    />
                  </div>

                  <Textarea
                    placeholder="Notas ou reflexões..."
                    value={r.notes}
                    onChange={(e) => updateNotes(dim.key, e.target.value)}
                    onBlur={() => handleSave(dim.key)}
                    className="h-16 text-sm"
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
