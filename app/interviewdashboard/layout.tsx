import TopNavbar from '@/components/shared/TopNavbar';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopNavbar />
      <div>{children}</div>
    </div>
  );
}

export default layout;
