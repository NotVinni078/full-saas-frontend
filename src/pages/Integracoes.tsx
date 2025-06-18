
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, CreditCard, Mail, Bot, Webhook, MessageSquare, Workflow, DollarSign } from 'lucide-react';

const Integracoes = () => {
  const [n8nConfig, setN8nConfig] = useState({
    url: '',
    webhookUrl: '',
    apiKey: ''
  });

  const [dialogflowConfig, setDialogflowConfig] = useState({
    projectId: '',
    privateKey: '',
    clientEmail: '',
    languageCode: 'pt-BR'
  });

  const [typebotConfig, setTypebotConfig] = useState({
    typebotId: '',
    apiToken: '',
    publicId: ''
  });

  const [webhooksConfig, setWebhooksConfig] = useState({
    url: '',
    secret: '',
    events: {
      messageReceived: false,
      messageRead: false,
      conversationStarted: false,
      conversationClosed: false
    }
  });

  const [asaasConfig, setAsaasConfig] = useState({
    apiKey: '',
    environment: 'sandbox',
    webhookUrl: ''
  });

  const [mercadoPagoConfig, setMercadoPagoConfig] = useState({
    accessToken: '',
    publicKey: '',
    webhookUrl: '',
    environment: 'sandbox'
  });

  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    secure: true,
    fromName: '',
    fromEmail: ''
  });

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Integrações</h1>
        
        <Tabs defaultValue="automacoes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="automacoes" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automações
            </TabsTrigger>
            <TabsTrigger value="pagamento" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Integrações de Pagamento
            </TabsTrigger>
            <TabsTrigger value="smtp" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              SMTP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automacoes" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* N8N Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="w-5 h-5" />
                    N8N
                  </CardTitle>
                  <CardDescription>
                    Configure N8N para automação de workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="n8n-url">URL do N8N</Label>
                    <Input
                      id="n8n-url"
                      placeholder="https://n8n.exemplo.com"
                      value={n8nConfig.url}
                      onChange={(e) => setN8nConfig({...n8nConfig, url: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="n8n-webhook">Webhook URL</Label>
                    <Input
                      id="n8n-webhook"
                      placeholder="https://n8n.exemplo.com/webhook/..."
                      value={n8nConfig.webhookUrl}
                      onChange={(e) => setN8nConfig({...n8nConfig, webhookUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="n8n-api-key">API Key</Label>
                    <Input
                      id="n8n-api-key"
                      type="password"
                      placeholder="n8n_api_key_..."
                      value={n8nConfig.apiKey}
                      onChange={(e) => setN8nConfig({...n8nConfig, apiKey: e.target.value})}
                    />
                  </div>
                  <Button className="w-full">Salvar Configuração N8N</Button>
                </CardContent>
              </Card>

              {/* Dialogflow Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Dialogflow
                  </CardTitle>
                  <CardDescription>
                    Configure Dialogflow para chatbot com IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="df-project-id">Project ID</Label>
                    <Input
                      id="df-project-id"
                      placeholder="meu-projeto-dialogflow"
                      value={dialogflowConfig.projectId}
                      onChange={(e) => setDialogflowConfig({...dialogflowConfig, projectId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="df-client-email">Client Email</Label>
                    <Input
                      id="df-client-email"
                      placeholder="service-account@projeto.iam.gserviceaccount.com"
                      value={dialogflowConfig.clientEmail}
                      onChange={(e) => setDialogflowConfig({...dialogflowConfig, clientEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="df-private-key">Private Key (JSON)</Label>
                    <Textarea
                      id="df-private-key"
                      placeholder="-----BEGIN PRIVATE KEY-----\n..."
                      value={dialogflowConfig.privateKey}
                      onChange={(e) => setDialogflowConfig({...dialogflowConfig, privateKey: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="df-language">Idioma</Label>
                    <Input
                      id="df-language"
                      placeholder="pt-BR"
                      value={dialogflowConfig.languageCode}
                      onChange={(e) => setDialogflowConfig({...dialogflowConfig, languageCode: e.target.value})}
                    />
                  </div>
                  <Button className="w-full">Salvar Configuração Dialogflow</Button>
                </CardContent>
              </Card>

              {/* Typebot Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Typebot
                  </CardTitle>
                  <CardDescription>
                    Configure Typebot para chatbots visuais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="typebot-id">Typebot ID</Label>
                    <Input
                      id="typebot-id"
                      placeholder="typebot_123456"
                      value={typebotConfig.typebotId}
                      onChange={(e) => setTypebotConfig({...typebotConfig, typebotId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="typebot-public-id">Public ID</Label>
                    <Input
                      id="typebot-public-id"
                      placeholder="meu-typebot-publico"
                      value={typebotConfig.publicId}
                      onChange={(e) => setTypebotConfig({...typebotConfig, publicId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="typebot-token">API Token</Label>
                    <Input
                      id="typebot-token"
                      type="password"
                      placeholder="tb_api_..."
                      value={typebotConfig.apiToken}
                      onChange={(e) => setTypebotConfig({...typebotConfig, apiToken: e.target.value})}
                    />
                  </div>
                  <Button className="w-full">Salvar Configuração Typebot</Button>
                </CardContent>
              </Card>

              {/* Webhooks Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="w-5 h-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Configure webhooks para integrar com sistemas externos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-url">URL do Webhook</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://api.exemplo.com/webhook"
                      value={webhooksConfig.url}
                      onChange={(e) => setWebhooksConfig({...webhooksConfig, url: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="webhook-secret">Secret (Opcional)</Label>
                    <Input
                      id="webhook-secret"
                      type="password"
                      placeholder="webhook_secret_123"
                      value={webhooksConfig.secret}
                      onChange={(e) => setWebhooksConfig({...webhooksConfig, secret: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Eventos para Enviar</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="event-message-received"
                          checked={webhooksConfig.events.messageReceived}
                          onCheckedChange={(checked) => 
                            setWebhooksConfig({
                              ...webhooksConfig, 
                              events: {...webhooksConfig.events, messageReceived: !!checked}
                            })
                          }
                        />
                        <Label htmlFor="event-message-received">Mensagem Recebida</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="event-message-read"
                          checked={webhooksConfig.events.messageRead}
                          onCheckedChange={(checked) => 
                            setWebhooksConfig({
                              ...webhooksConfig, 
                              events: {...webhooksConfig.events, messageRead: !!checked}
                            })
                          }
                        />
                        <Label htmlFor="event-message-read">Mensagem Lida</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="event-conversation-started"
                          checked={webhooksConfig.events.conversationStarted}
                          onCheckedChange={(checked) => 
                            setWebhooksConfig({
                              ...webhooksConfig, 
                              events: {...webhooksConfig.events, conversationStarted: !!checked}
                            })
                          }
                        />
                        <Label htmlFor="event-conversation-started">Conversa Iniciada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="event-conversation-closed"
                          checked={webhooksConfig.events.conversationClosed}
                          onCheckedChange={(checked) => 
                            setWebhooksConfig({
                              ...webhooksConfig, 
                              events: {...webhooksConfig.events, conversationClosed: !!checked}
                            })
                          }
                        />
                        <Label htmlFor="event-conversation-closed">Conversa Encerrada</Label>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">Salvar Configuração Webhooks</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pagamento" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* ASAAS Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    ASAAS
                  </CardTitle>
                  <CardDescription>
                    Configure ASAAS para processar pagamentos PIX, boleto e cartão
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="asaas-api-key">API Key ASAAS</Label>
                    <Input
                      id="asaas-api-key"
                      type="password"
                      placeholder="$aact_YTU5YjQ0..."
                      value={asaasConfig.apiKey}
                      onChange={(e) => setAsaasConfig({...asaasConfig, apiKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="asaas-environment">Ambiente</Label>
                    <Select 
                      value={asaasConfig.environment} 
                      onValueChange={(value) => setAsaasConfig({...asaasConfig, environment: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ambiente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                        <SelectItem value="production">Produção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="asaas-webhook">Webhook URL</Label>
                    <Input
                      id="asaas-webhook"
                      placeholder="https://seusite.com/webhook/asaas"
                      value={asaasConfig.webhookUrl}
                      onChange={(e) => setAsaasConfig({...asaasConfig, webhookUrl: e.target.value})}
                    />
                  </div>
                  <Button className="w-full">Salvar Configuração ASAAS</Button>
                </CardContent>
              </Card>

              {/* Mercado Pago Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Mercado Pago
                  </CardTitle>
                  <CardDescription>
                    Configure Mercado Pago para processar pagamentos PIX, cartão e boleto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="mp-access-token">Access Token</Label>
                    <Input
                      id="mp-access-token"
                      type="password"
                      placeholder="APP_USR-..."
                      value={mercadoPagoConfig.accessToken}
                      onChange={(e) => setMercadoPagoConfig({...mercadoPagoConfig, accessToken: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mp-public-key">Public Key</Label>
                    <Input
                      id="mp-public-key"
                      placeholder="APP_USR-..."
                      value={mercadoPagoConfig.publicKey}
                      onChange={(e) => setMercadoPagoConfig({...mercadoPagoConfig, publicKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mp-environment">Ambiente</Label>
                    <Select 
                      value={mercadoPagoConfig.environment} 
                      onValueChange={(value) => setMercadoPagoConfig({...mercadoPagoConfig, environment: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ambiente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                        <SelectItem value="production">Produção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mp-webhook">Webhook URL</Label>
                    <Input
                      id="mp-webhook"
                      placeholder="https://seusite.com/webhook/mercadopago"
                      value={mercadoPagoConfig.webhookUrl}
                      onChange={(e) => setMercadoPagoConfig({...mercadoPagoConfig, webhookUrl: e.target.value})}
                    />
                  </div>
                  <Button className="w-full">Salvar Configuração Mercado Pago</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="smtp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Configuração SMTP
                </CardTitle>
                <CardDescription>
                  Configure seu servidor de email para envio de notificações e relatórios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="smtp-host">Servidor SMTP</Label>
                    <Input
                      id="smtp-host"
                      placeholder="smtp.gmail.com"
                      value={smtpConfig.host}
                      onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port">Porta</Label>
                    <Input
                      id="smtp-port"
                      placeholder="587"
                      value={smtpConfig.port}
                      onChange={(e) => setSmtpConfig({...smtpConfig, port: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="smtp-username">Usuário/Email</Label>
                    <Input
                      id="smtp-username"
                      placeholder="seu-email@gmail.com"
                      value={smtpConfig.username}
                      onChange={(e) => setSmtpConfig({...smtpConfig, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-password">Senha/Token</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      placeholder="sua-senha-ou-token"
                      value={smtpConfig.password}
                      onChange={(e) => setSmtpConfig({...smtpConfig, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="smtp-from-name">Nome do Remetente</Label>
                    <Input
                      id="smtp-from-name"
                      placeholder="Sua Empresa"
                      value={smtpConfig.fromName}
                      onChange={(e) => setSmtpConfig({...smtpConfig, fromName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-from-email">Email do Remetente</Label>
                    <Input
                      id="smtp-from-email"
                      placeholder="noreply@suaempresa.com"
                      value={smtpConfig.fromEmail}
                      onChange={(e) => setSmtpConfig({...smtpConfig, fromEmail: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smtp-secure"
                    checked={smtpConfig.secure}
                    onCheckedChange={(checked) => setSmtpConfig({...smtpConfig, secure: !!checked})}
                  />
                  <Label htmlFor="smtp-secure">Usar conexão segura (TLS/SSL)</Label>
                </div>
                <Button className="w-full">Salvar Configuração SMTP</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Integracoes;
