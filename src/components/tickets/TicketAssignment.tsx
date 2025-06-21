
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserMinus, Bell } from 'lucide-react';
import { TenantTicket, useTenantTickets } from '@/hooks/useTenantTickets';
import { useUsers } from '@/hooks/useUsers';
import { toast } from '@/hooks/use-toast';

interface TicketAssignmentProps {
  ticket: TenantTicket;
  onAssignmentChange?: (ticketId: string, userId: string | null) => void;
}

const TicketAssignment: React.FC<TicketAssignmentProps> = ({ 
  ticket, 
  onAssignmentChange 
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const { assignTicket, updateTicket } = useTenantTickets();
  const { getActiveUsers } = useUsers();
  
  const activeUsers = getActiveUsers();

  const handleAssignUser = async (userId: string) => {
    if (userId === ticket.assigned_user_id) return;
    
    setIsAssigning(true);
    try {
      await assignTicket(ticket.id, userId);
      
      const assignedUser = activeUsers.find(u => u.id === userId);
      
      // Show success notification
      toast({
        title: "Ticket Atribuído",
        description: `Ticket atribuído para ${assignedUser?.nome || 'usuário'}`,
      });

      // Trigger callback if provided
      onAssignmentChange?.(ticket.id, userId);
      
    } catch (error) {
      console.error('Error assigning ticket:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async () => {
    setIsAssigning(true);
    try {
      await updateTicket(ticket.id, { assigned_user_id: undefined });
      
      toast({
        title: "Atribuição Removida",
        description: "Ticket não está mais atribuído a nenhum agente",
      });

      onAssignmentChange?.(ticket.id, null);
      
    } catch (error) {
      console.error('Error unassigning ticket:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Atribuição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ticket.assigned_user && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {ticket.assigned_user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{ticket.assigned_user.name}</p>
                  <p className="text-sm text-muted-foreground">{ticket.assigned_user.email}</p>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                Atribuído
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnassign}
              disabled={isAssigning}
              className="mt-3 w-full"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Remover Atribuição
            </Button>
          </div>
        )}

        {!ticket.assigned_user && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Este ticket ainda não foi atribuído a nenhum agente.
            </p>
            
            <Select 
              onValueChange={handleAssignUser}
              disabled={isAssigning}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar agente..." />
              </SelectTrigger>
              <SelectContent>
                {activeUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.nome}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {ticket.assigned_user && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Reatribuir para outro agente:</p>
            <Select 
              onValueChange={handleAssignUser}
              disabled={isAssigning}
              value={ticket.assigned_user_id || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar novo agente..." />
              </SelectTrigger>
              <SelectContent>
                {activeUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.nome}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketAssignment;
