
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Opções</h1>
        <p className="text-gray-600">Configure as opções gerais do sistema</p>
      </div>

      {/* LGPD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">LGPD - Lei Geral de Proteção de Dados</CardTitle>
          <CardDescription>
            Controla a aplicação das regras de proteção de dados pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="lgpd"
              checked={lgpdEnabled}
              onCheckedChange={setLgpdEnabled}
            />
            <Label htmlFor="lgpd" className="text-sm font-medium">
              {lgpdEnabled ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Avaliações NPS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avaliações de NPS</CardTitle>
          <CardDescription>
            Define como as avaliações de NPS serão enviadas aos clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={npsEvaluation} onValueChange={setNpsEvaluation}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="automatico" id="nps-auto" />
              <Label htmlFor="nps-auto">Enviar ao final do atendimento</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="nps-manual" />
              <Label htmlFor="nps-manual">Enviar manualmente</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Tipo de Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de Agendamento de Expediente</CardTitle>
          <CardDescription>
            Define se o agendamento será por empresa ou por setor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={agendamentoTipo} onValueChange={setAgendamentoTipo}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="empresa" id="agenda-empresa" />
              <Label htmlFor="agenda-empresa">Empresa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="setor" id="agenda-setor" />
              <Label htmlFor="agenda-setor">Setor</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Mensagem ao Aceitar Atendimento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mensagem ao Aceitar Atendimento</CardTitle>
          <CardDescription>
            Envia mensagem automática quando o atendimento for aceito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="mensagem-aceitar"
              checked={mensagemAceitar}
              onCheckedChange={setMensagemAceitar}
            />
            <Label htmlFor="mensagem-aceitar" className="text-sm font-medium">
              {mensagemAceitar ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Mensagens</CardTitle>
          <CardDescription>
            Define o escopo do histórico de mensagens visualizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={historicoMensagens} onValueChange={setHistoricoMensagens}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completo" id="historico-completo" />
              <Label htmlFor="historico-completo">Completo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="setor" id="historico-setor" />
              <Label htmlFor="historico-setor">Setor</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Ignorar Mensagens de Grupos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ignorar Mensagens de Grupos</CardTitle>
          <CardDescription>
            Define se mensagens de grupos do WhatsApp devem ser ignoradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="ignorar-grupos"
              checked={ignorarGrupos}
              onCheckedChange={setIgnorarGrupos}
            />
            <Label htmlFor="ignorar-grupos" className="text-sm font-medium">
              {ignorarGrupos ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Ligações WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ligações WhatsApp</CardTitle>
          <CardDescription>
            Permite ou bloqueia ligações através do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="ligacoes-whatsapp"
              checked={ligacoesWhatsapp}
              onCheckedChange={setLigacoesWhatsapp}
            />
            <Label htmlFor="ligacoes-whatsapp" className="text-sm font-medium">
              {ligacoesWhatsapp ? 'Habilitado' : 'Desabilitado'}
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjustesOptions;
