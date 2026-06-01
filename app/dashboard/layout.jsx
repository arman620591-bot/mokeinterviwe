import React from 'react';

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-8 sm:pt-12">
      <main className="container mx-auto px-4 pb-12">
        {children}
      
      </main>

    </div>
  );
}

export default DashboardLayout;
