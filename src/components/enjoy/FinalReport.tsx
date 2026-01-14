import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Sparkles, Download, User } from 'lucide-react';
import type { FinalReport as FinalReportType } from '@/types/enjoy';

interface Props {
  report: FinalReportType | null;
  onGenerate: (journeySummary: string, keyLearnings: string[], newProfessionalIdentity: string) => Promise<void>;
}

export const FinalReport = ({ report, onGenerate }: Props) => {
  const [journeySummary, setJourneySummary] = useState(report?.journey_summary || '');
  const [keyLearnings, setKeyLearnings] = useState<string[]>(report?.key_learnings || ['']);
  const [newIdentity, setNewIdentity] = useState(report?.new_professional_identity || '');

  const handleAddLearning = () => {
    setKeyLearnings([...keyLearnings, '']);
  };

  const handleRemoveLearning = (index: number) => {
    setKeyLearnings(keyLearnings.filter((_, i) => i !== index));
  };

  const handleLearningChange = (index: number, value: string) => {
    const updated = [...keyLearnings];
    updated[index] = value;
    setKeyLearnings(updated);
  };

  const handleGenerate = async () => {
    const filteredLearnings = keyLearnings.filter(l => l.trim());
    await onGenerate(journeySummary, filteredLearnings, newIdentity);
  };

  if (report) {
    return (
      <Card className="border-secondary/20 bg-gradient-to-br from-background to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-secondary" />
            Relatório Final Migrei
            <Badge variant="secondary" className="ml-2">Gerado</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-primary">{report.total_xp_earned}</p>
              <p className="text-sm text-muted-foreground">XP Total</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-secondary">{report.phases_completed}</p>
              <p className="text-sm text-muted-foreground">Fases Completas</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-amber-500">{report.total_days}</p>
              <p className="text-sm text-muted-foreground">Dias de Jornada</p>
            </div>
          </div>

          {/* Journey Summary */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Resumo da Jornada
            </h4>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm">{report.journey_summary || 'Nenhum resumo adicionado'}</p>
            </div>
          </div>

          {/* Key Learnings */}
          <div className="space-y-2">
            <h4 className="font-semibold">Aprendizados-Chave</h4>
            <div className="space-y-2">
              {report.key_learnings.map((learning, index) => (
                <div key={index} className="flex items-start gap-2 bg-muted/30 rounded-lg p-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm flex-1">{learning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* New Professional Identity */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-secondary" />
              Nova Identidade Profissional
            </h4>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-lg font-medium text-center italic">
                "{report.new_professional_identity || 'Identidade não definida'}"
              </p>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-secondary" />
          Relatório Final Migrei
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Journey Summary */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Resumo da sua Jornada</label>
          <Textarea
            placeholder="Descreva como foi sua jornada de transição profissional, os desafios que enfrentou e como os superou..."
            value={journeySummary}
            onChange={(e) => setJourneySummary(e.target.value)}
            rows={4}
          />
        </div>

        {/* Key Learnings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Aprendizados-Chave</label>
            <Button variant="ghost" size="sm" onClick={handleAddLearning} className="gap-1">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {keyLearnings.map((learning, index) => (
              <div key={index} className="flex gap-2">
                <span className="flex items-center justify-center w-8 h-10 bg-muted rounded text-sm font-medium">
                  {index + 1}
                </span>
                <Input
                  placeholder="O que você aprendeu?"
                  value={learning}
                  onChange={(e) => handleLearningChange(index, e.target.value)}
                  className="flex-1"
                />
                {keyLearnings.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveLearning(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* New Professional Identity */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nova Identidade Profissional</label>
          <p className="text-xs text-muted-foreground">
            Defina em uma frase quem você é agora como profissional
          </p>
          <Input
            placeholder="Ex: Sou um profissional de UX Design focado em acessibilidade digital"
            value={newIdentity}
            onChange={(e) => setNewIdentity(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          className="w-full gap-2"
          disabled={!journeySummary.trim() || !newIdentity.trim()}
        >
          <Sparkles className="h-4 w-4" />
          Gerar Relatório Final
        </Button>
      </CardContent>
    </Card>
  );
};
