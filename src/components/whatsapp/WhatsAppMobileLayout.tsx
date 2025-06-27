
import React from 'react';
import WhatsAppSidebar from './WhatsAppSidebar';
import WhatsAppChatArea from './WhatsAppChatArea';
import WhatsAppCreateTicketModal from './WhatsAppCreateTicketModal';
import AssignmentNotification from '@/components/tickets/AssignmentNotification';
import { TenantTicket } from '@/hooks/useTenantTickets';
import { TenantContact, TenantConnection } from '@/hooks/useTenantData';

interface WhatsAppMobileLayoutProps {
  selectedTicket: TenantTicket | null;
  onTicketSelect: (ticket: TenantTicket) => void;
  onCreateTicket: () => void;
  onStatusChange: (status: TenantTicket['status']) => void;
  onAssignmentChange: (ticketId: string, userId: string | null) => void;
  onBack: () => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  newTicketForm: any;
  setNewTicketForm: (form: any) => void;
  handleCreateTicket: () => void;
  contacts: TenantContact[];
  connections: TenantConnection[];
  showAssignmentNotification: any;
  setShowAssignmentNotification: (notification: any) => void;
}

const WhatsAppMobileLayout: React.FC<WhatsAppMobileLayoutProps> = ({
  selectedTicket,
  onTicketSelect,
  onCreateTicket,
  onStatusChange,
  onAssignmentChange,
  onBack,
  showCreateModal,
  setShowCreateModal,
  newTicketForm,
  setNewTicketForm,
  handleCreateTicket,
  contacts,
  connections,
  showAssignmentNotification,
  setShowAssignmentNotification
}) => {
  return (
    <div className="flex h-full bg-background relative">
      {/* Lista de Tickets - Tela inteira no mobile */}
      <div className={`w-full bg-card transition-transform duration-300 ${
        selectedTicket ? '-translate-x-full absolute' : 'translate-x-0'
      }`}>
        <WhatsAppSidebar
          selectedTicket={selectedTicket}
          onTicketSelect={onTicketSelect}
          onCreateTicket={onCreateTicket}
          isMobile={true}
        />
      </div>

      {/* Área do Chat - Tela inteira no mobile quando ticket selecionado */}
      <div className={`w-full bg-muted/10 transition-transform duration-300 ${
        selectedTicket ? 'translate-x-0' : 'translate-x-full absolute'
      }`}>
        <WhatsAppChatArea
          selectedTicket={selectedTicket}
          onStatusChange={onStatusChange}
          onAssignmentChange={onAssignmentChange}
          onBack={onBack}
          isMobile={true}
        />
      </div>

      {/* Modal de Criação de Ticket */}
      <WhatsAppCreateTicketModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newTicketForm={newTicketForm}
        setNewTicketForm={setNewTicketForm}
        handleCreateTicket={handleCreateTicket}
        contacts={contacts}
        connections={connections}
      />

      {/* Notificação de Atribuição */}
      {showAssignmentNotification && (
        <AssignmentNotification
          ticketTitle={showAssignmentNotification.ticketTitle}
          assignedUserName={showAssignmentNotification.assignedUserName}
          assignedBy={showAssignmentNotification.assignedBy}
          ticketId={showAssignmentNotification.ticketId}
        />
      )}
    </div>
  );
};

export default WhatsAppMobileLayout;
