import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen overflow-hidden">
      <Navbar />
      <div className='p-3'>{children}</div>
      <Footer />
    </main>
  );
}

export default DashboardLayout
