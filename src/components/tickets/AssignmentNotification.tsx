
import React, { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Bell, User } from 'lucide-react';

interface AssignmentNotificationProps {
  ticketTitle: string;
  assignedUserName: string;
  assignedBy?: string;
  ticketId: string;
}

const AssignmentNotification: React.FC<AssignmentNotificationProps> = ({
  ticketTitle,
  assignedUserName,
  assignedBy,
  ticketId
}) => {
  useEffect(() => {
    // Show assignment notification
    toast({
      title: "Novo Ticket Atribuído",
      description: (
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{ticketTitle}</p>
            <p className="text-sm text-muted-foreground">
              Atribuído para {assignedUserName}
              {assignedBy && ` por ${assignedBy}`}
            </p>
          </div>
        </div>
      ),
      duration: 5000,
    });
  }, [ticketTitle, assignedUserName, assignedBy, ticketId]);

  return null;
};

export default AssignmentNotification;
