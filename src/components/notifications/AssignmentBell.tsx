
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, User, Clock } from 'lucide-react';
import { useTicketAssignments } from '@/hooks/useTicketAssignments';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AssignmentBell: React.FC = () => {
  const { unreadAssignments, markAssignmentAsRead } = useTicketAssignments();

  const handleMarkAsRead = (assignmentId: string) => {
    markAssignmentAsRead(assignmentId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadAssignments.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadAssignments.length}
            </Badge>
          )}
          <span className="sr-only">Notificações de atribuição</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Tickets Atribuídos</h3>
            {unreadAssignments.length > 0 && (
              <Badge variant="secondary">{unreadAssignments.length} novos</Badge>
            )}
          </div>
          
          {unreadAssignments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma nova atribuição</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {unreadAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                    onClick={() => handleMarkAsRead(assignment.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-full">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {assignment.ticket?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Atribuído para {assignment.user?.name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(assignment.assigned_at, { 
                              locale: ptBR, 
                              addSuffix: true 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AssignmentBell;
