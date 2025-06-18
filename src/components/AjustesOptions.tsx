
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircleQuestion } from 'lucide-react';
import { useAjustes } from '@/pages/Ajustes';

const AjustesOptions = () => {
  const { agendamentoTipo, setAgendamentoTipo } = useAjustes();
  const [lgpdEnabled, setLgpdEnabled] = useState(true);
  const [npsEvaluation, setNpsEvaluation] = useState('manual');
  const [mensagemAceitar, setMensagemAceitar] = useState(false);
  const [historicoMensagens, setHistoricoMensagens] = useState('completo');
  const [ignorarGrupos, setIgnorarGrupos] = useState(true);
  const [ligacoesWhatsapp, setLigacoesWhatsapp] = useState(true);

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold brand-text-foreground mb-2">Opções</h1>
          <p className="brand-text-muted text-sm sm:text-base">Configure as opções gerais do sistema</p>
        </div>

        {/* LGPD */}
        <Card className="brand-card brand-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg brand-text-foreground">LGPD - Lei Geral de Proteção de Dados</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MessageCircleQuestion className="h-4 w-4 brand-text-muted cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs brand-card brand-border">
                  <p className="brand-text-foreground">Mensagens apagadas por clientes, nos atendimentos, serão apagadas para usuários com permissão de Atendente e Supervisor</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription className="text-xs sm:text-sm brand-text-muted">
              Controla a aplicação das regras de proteção de dados pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <Switch
                id="lgpd"
                checked={lgpdEnabled}
                onCheckedChange={setLgpdEnabled}
                className="data-[state=checked]:brand-primary data-[state=unchecked]:brand-gray-300"
              />
              <Label htmlFor="lgpd" className="text-xs sm:text-sm font-medium brand-text-foreground">
                {lgpdEnabled ? 'Habilitado' : 'Desabilitado'}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Avaliações NPS */}
        <Card className="brand-card brand-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg brand-text-foreground">Avaliações de NPS</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MessageCircleQuestion className="h-4 w-4 brand-text-muted cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs brand-card brand-border">
                  <p className="brand-text-foreground">Se habilitado, ao finalizar o atendimento o atendente será obrigado a enviar uma das pesquisas de satisfação, se Desabilitado o envio é opcional.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription className="text-xs sm:text-sm brand-text-muted">
              Define como as avaliações de NPS serão enviadas aos clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup value={npsEvaluation} onValueChange={setNpsEvaluation}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="automatico" id="nps-auto" className="brand-border brand-text-foreground data-[state=checked]:brand-primary data-[state=checked]:brand-border" />
                <Label htmlFor="nps-auto" className="text-xs sm:text-sm brand-text-foreground">Enviar ao final do atendimento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="nps-manual" className="brand-border brand-text-foreground data-[state=checked]:brand-primary data-[state=checked]:brand-border" />
                <Label htmlFor="nps-manual" className="text-xs sm:text-sm brand-text-foreground">Enviar manualmente</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Tipo de Agendamento */}
        <Card className="brand-card brand-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg brand-text-foreground">Tipo de Agendamento de Expediente</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MessageCircleQuestion className="h-4 w-4 brand-text-muted cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs brand-card brand-border">
                  <p className="brand-text-foreground">Se selecionado Empresa, todos os usuários com permissão de Atendente, e supervisor só conseguirão usar a plataforma no horário permitido, se selecionado Setor, o horário de funcionamento dos usuários Atendente e Supervisor, será de acordo ao seu setor, se Selecionado Cargo, fará a mesma regra, porém por cargo. Não se aplica a Cargo de Gestor.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription className="text-xs sm:text-sm brand-text-muted">
              Define se o agendamento será por empresa, setor ou cargo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup value={agendamentoTipo} onValueChange={setAgendamentoTipo}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="empresa" id="agenda-empresa" className="brand-border brand-text-foreground data-[state=checked]:brand-primary data-[state=checked]:brand-border" />
                <Label htmlFor="agenda-empresa" className="text-xs sm:text-sm brand-text-foreground">Empresa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="setor" id="agenda-setor" className="brand-border brand-text-foreground data-[state=checked]:brand-primary data-[state=checked]:brand-border" />
                <Label htmlFor="agenda-setor" className="text-xs sm:text-sm brand-text-foreground">Setor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cargo" id="agenda-cargo" className="brand-border brand-text-foreground data-[state=checked]:brand-primary data-[state=checked]:brand-border" />
                <Label htmlFor="agenda-cargo" className="text-xs sm:text-sm brand-text-foreground">Cargo</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Mensagem ao Aceitar Atendimento */}
        <Card className="brand-card brand-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg brand-text-foreground">Mensagem ao Aceitar Atendimento</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MessageCircleQuestion className="h-4 w-4 brand-text-muted cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs brand-card brand-border">
                  <p className="brand-text-foreground">Se hablitado, sempre que um atendente iniciar um atendimento que estava em aguardando será disparado a mensagem configurada nas Mensagens padrões.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription className="text-xs sm:text-sm brand-text-muted">
              Envia mensagem automática quando o atendimento for aceito
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <Switch
                id="mensagem-aceitar"
                checked={mensagemAceitar}
                onCheckedChange={setMensagemAceitar}
                className="data-[state=checked]:brand-primary data-[state=unchecked]:brand-gray-300"
              />
              <Label htmlFor="mensagem-aceitar" className="text-xs sm:text-sm font-medium brand-text-foreground">
                {mensagemAceitar ? 'Habilitado' : 'Desabilitado'}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Mensagens */}
        <Card className="brand-card brand-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg brand-text-foreground">Histórico de Mensagens</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MessageCircleQuestion className="h-4 w-4 brand-text-muted cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs brand-card brand-border">
                  <p className="brand-text-foreground">Se exibir por setor, cada usuario da plataforma, só verá as conversas do atendimento, quando o cliente estava em um setor atrelado a esse usuario, se selecionado completo, o atendente verá todo o historico de conversa, de todos os setores (recomendado).</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription className="text-xs sm:text-sm brand-text-muted">
              Define o escopo do histórico de mensagens visualizado
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <RadioGroup value={historicoMensagens} onValueChange={setHistoricoMensagens}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completo" id="historico-completo" className="brand-border brand-text-foreground data-[state=checked]:brand-primary data-[state=checked]:brand-border" />
                <Label htmlFor="historico-completo" className="text-xs sm:text-sm brand-text-foreground">Completo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="setor" id="historico-setor" className="brand-border brand-text-foreground data-[state=checked]:brand-primary data-[state=checked]:brand-border" />
                <Label htmlFor="historico-setor" className="text-xs sm:text-sm brand-text-foreground">Setor</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Ignorar Mensagens de Grupos */}
        <Card className="brand-card brand-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg brand-text-foreground">Ignorar Mensagens de Grupos</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MessageCircleQuestion className="h-4 w-4 brand-text-muted cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs brand-card brand-border">
                  <p className="brand-text-foreground">Se habilitado, o sistema irá notificar mensagens de grupos, Desabilitar é o mesmo que silenciar os grupos.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription className="text-xs sm:text-sm brand-text-muted">
              Define se mensagens de grupos do WhatsApp devem ser ignoradas
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <Switch
                id="ignorar-grupos"
                checked={ignorarGrupos}
                onCheckedChange={setIgnorarGrupos}
                className="data-[state=checked]:brand-primary data-[state=unchecked]:brand-gray-300"
              />
              <Label htmlFor="ignorar-grupos" className="text-xs sm:text-sm font-medium brand-text-foreground">
                {ignorarGrupos ? 'Habilitado' : 'Desabilitado'}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Ligações WhatsApp */}
        <Card className="brand-card brand-border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg brand-text-foreground">Ligações WhatsApp</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MessageCircleQuestion className="h-4 w-4 brand-text-muted cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs brand-card brand-border">
                  <p className="brand-text-foreground">Se Desabilitado, ao receber uma ligação via WhatsApp, a mesma será recusada automaticamente, e enviada a mensagem cadastrada em Mensagens padrões(Deixe vazia em caso de não enviar nenhuma mensagem).Se Habiltiado, as ligações de WhatsApp poderão ser atendidas no dispositivo movel.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardDescription className="text-xs sm:text-sm brand-text-muted">
              Permite ou bloqueia ligações através do WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <Switch
                id="ligacoes-whatsapp"
                checked={ligacoesWhatsapp}
                onCheckedChange={setLigacoesWhatsapp}
                className="data-[state=checked]:brand-primary data-[state=unchecked]:brand-gray-300"
              />
              <Label htmlFor="ligacoes-whatsapp" className="text-xs sm:text-sm font-medium brand-text-foreground">
                {ligacoesWhatsapp ? 'Habilitado' : 'Desabilitado'}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default AjustesOptions;
