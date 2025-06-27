
import React from 'react';
import WhatsAppSidebar from './WhatsAppSidebar';
import WhatsAppChatArea from './WhatsAppChatArea';
import WhatsAppCreateTicketModal from './WhatsAppCreateTicketModal';
import AssignmentNotification from '@/components/tickets/AssignmentNotification';
import { TenantTicket } from '@/hooks/useTenantTickets';
import { TenantContact, TenantConnection } from '@/hooks/useTenantData';

interface WhatsAppDesktopLayoutProps {
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

const WhatsAppDesktopLayout: React.FC<WhatsAppDesktopLayoutProps> = ({
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
    <div className="flex h-full bg-background">
      {/* Sidebar - Lista de Tickets (similar ao painel esquerdo do WhatsApp) */}
      <div className="w-96 bg-card border-r border-border flex flex-col">
        <WhatsAppSidebar
          selectedTicket={selectedTicket}
          onTicketSelect={onTicketSelect}
          onCreateTicket={onCreateTicket}
        />
      </div>

      {/* Área Principal - Chat/Ticket (similar ao painel direito do WhatsApp) */}
      <div className="flex-1 bg-muted/10">
        <WhatsAppChatArea
          selectedTicket={selectedTicket}
          onStatusChange={onStatusChange}
          onAssignmentChange={onAssignmentChange}
          onBack={onBack}
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

export default WhatsAppDesktopLayout;
