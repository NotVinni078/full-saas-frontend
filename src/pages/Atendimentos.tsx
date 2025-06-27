
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import WhatsAppDesktopLayout from '@/components/whatsapp/WhatsAppDesktopLayout';
import WhatsAppMobileLayout from '@/components/whatsapp/WhatsAppMobileLayout';
import { useTenantTickets, TenantTicket } from '@/hooks/useTenantTickets';
import { useTenantDataContext } from '@/contexts/TenantDataContext';

const Atendimentos = () => {
  const isMobile = useIsMobile();
  const [selectedTicket, setSelectedTicket] = useState<TenantTicket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentNotification, setShowAssignmentNotification] = useState<{
    ticketTitle: string;
    assignedUserName: string;
    assignedBy?: string;
    ticketId: string;
  } | null>(null);
  
  // Updated form states for creating new ticket (removed priority)
  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    description: '',
    contact_id: '',
    channel: 'whatsapp' as TenantTicket['channel']
  });

  const { createTicket, updateTicket } = useTenantTickets();
  const { contacts, connections } = useTenantDataContext();

  const handleCreateTicket = async () => {
    if (!newTicketForm.title.trim() || !newTicketForm.contact_id) {
      return;
    }

    await createTicket({
      title: newTicketForm.title,
      description: newTicketForm.description,
      contact_id: newTicketForm.contact_id,
      priority: 'normal', // Set default priority since it's not in the form
      channel: newTicketForm.channel,
      status: 'open',
      tags: [],
      custom_fields: {}
    });

    setShowCreateModal(false);
    setNewTicketForm({
      title: '',
      description: '',
      contact_id: '',
      channel: 'whatsapp'
    });
  };

  const handleTicketSelect = (ticket: TenantTicket) => {
    setSelectedTicket(ticket);
  };

  const handleStatusChange = async (status: TenantTicket['status']) => {
    if (!selectedTicket) return;
    
    await updateTicket(selectedTicket.id, { status });
    setSelectedTicket({ ...selectedTicket, status });
  };

  const handleAssignmentChange = (ticketId: string, userId: string | null) => {
    if (selectedTicket && userId) {
      const updatedTicket = { 
        ...selectedTicket, 
        assigned_user_id: userId,
        assigned_user: {
          id: userId,
          name: 'Usuario',
          email: 'user@example.com'
        }
      };
      setSelectedTicket(updatedTicket);

      setShowAssignmentNotification({
        ticketTitle: selectedTicket.title,
        assignedUserName: 'Agente',
        ticketId: ticketId
      });
    }
  };

  const handleBack = () => {
    setSelectedTicket(null);
  };

  const commonProps = {
    selectedTicket,
    onTicketSelect: handleTicketSelect,
    onCreateTicket: () => setShowCreateModal(true),
    onStatusChange: handleStatusChange,
    onAssignmentChange: handleAssignmentChange,
    onBack: handleBack,
    showCreateModal,
    setShowCreateModal,
    newTicketForm,
    setNewTicketForm,
    handleCreateTicket,
    contacts,
    connections, // Add connections to props
    showAssignmentNotification,
    setShowAssignmentNotification
  };

  return (
    <SidebarLayout>
      <div className="h-[calc(100vh-64px)] bg-background overflow-hidden">
        {isMobile ? (
          <WhatsAppMobileLayout {...commonProps} />
        ) : (
          <WhatsAppDesktopLayout {...commonProps} />
        )}
      </div>
    </SidebarLayout>
  );
};

export default Atendimentos;
