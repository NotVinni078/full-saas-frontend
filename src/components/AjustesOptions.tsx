
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AjustesOptions = () => {
  const [lgpdEnabled, setLgpdEnabled] = useState(true);
  const [npsEvaluation, setNpsEvaluation] = useState('manual');
  const [agendamentoTipo, setAgendamentoTipo] = useState('empresa');
  const [mensagemAceitar, setMensagemAceitar] = useState(false);
  const [historicoMensagens, setHistoricoMensagens] = useState('completo');
  const [ignorarGrupos, setIgnorarGrupos] = useState(true);
  const [ligacoesWhatsapp, setLigacoesWhatsapp] = useState(true);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Opções</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Configure as opções gerais do sistema</p>
      </div>

      {/* LGPD */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground">LGPD - Lei Geral de Proteção de Dados</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Controla a aplicação das regras de proteção de dados pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2">
            <Switch
              id="lgpd"
              checked={lgpdEnabled}
              onCheckedChange={setLgpdEnabled}
            />
            <Label htmlFor="lgpd" className="text-xs sm:text-sm font-medium text-foreground">
              {lgpdEnabled ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Avaliações NPS */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground">Avaliações de NPS</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Define como as avaliações de NPS serão enviadas aos clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup value={npsEvaluation} onValueChange={setNpsEvaluation}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="automatico" id="nps-auto" />
              <Label htmlFor="nps-auto" className="text-xs sm:text-sm text-foreground">Enviar ao final do atendimento</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="nps-manual" />
              <Label htmlFor="nps-manual" className="text-xs sm:text-sm text-foreground">Enviar manualmente</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Tipo de Agendamento */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground">Tipo de Agendamento de Expediente</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Define se o agendamento será por empresa ou por setor
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup value={agendamentoTipo} onValueChange={setAgendamentoTipo}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="empresa" id="agenda-empresa" />
              <Label htmlFor="agenda-empresa" className="text-xs sm:text-sm text-foreground">Empresa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="setor" id="agenda-setor" />
              <Label htmlFor="agenda-setor" className="text-xs sm:text-sm text-foreground">Setor</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Mensagem ao Aceitar Atendimento */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground">Mensagem ao Aceitar Atendimento</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Envia mensagem automática quando o atendimento for aceito
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2">
            <Switch
              id="mensagem-aceitar"
              checked={mensagemAceitar}
              onCheckedChange={setMensagemAceitar}
            />
            <Label htmlFor="mensagem-aceitar" className="text-xs sm:text-sm font-medium text-foreground">
              {mensagemAceitar ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Mensagens */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground">Histórico de Mensagens</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Define o escopo do histórico de mensagens visualizado
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup value={historicoMensagens} onValueChange={setHistoricoMensagens}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completo" id="historico-completo" />
              <Label htmlFor="historico-completo" className="text-xs sm:text-sm text-foreground">Completo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="setor" id="historico-setor" />
              <Label htmlFor="historico-setor" className="text-xs sm:text-sm text-foreground">Setor</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Ignorar Mensagens de Grupos */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground">Ignorar Mensagens de Grupos</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Define se mensagens de grupos do WhatsApp devem ser ignoradas
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2">
            <Switch
              id="ignorar-grupos"
              checked={ignorarGrupos}
              onCheckedChange={setIgnorarGrupos}
            />
            <Label htmlFor="ignorar-grupos" className="text-xs sm:text-sm font-medium text-foreground">
              {ignorarGrupos ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Ligações WhatsApp */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-card-foreground">Ligações WhatsApp</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Permite ou bloqueia ligações através do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-2">
            <Switch
              id="ligacoes-whatsapp"
              checked={ligacoesWhatsapp}
              onCheckedChange={setLigacoesWhatsapp}
            />
            <Label htmlFor="ligacoes-whatsapp" className="text-xs sm:text-sm font-medium text-foreground">
              {ligacoesWhatsapp ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjustesOptions;
