
import React from 'react';
import ChatInterno from '@/components/ChatInterno';
import SidebarLayout from '@/components/SidebarLayout';

const ChatInternoPage = () => {
  return (
    <SidebarLayout>
      <div className="brand-background min-h-full">
        <ChatInterno />
      </div>
    </SidebarLayout>
  );
};

export default ChatInternoPage;
