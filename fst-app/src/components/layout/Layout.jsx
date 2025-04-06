import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

/**
 * Main application layout component
 * Handles layout structure and sidebar state
 */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Toggle sidebar function that will be passed to Header
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
    console.log('Toggling sidebar');
  }, []);
  
  // For closing the sidebar specifically
  const closeSidebar = useCallback(() => {
    console.log('Closing sidebar');
    setSidebarOpen(false);
  }, []);
  
  return (
    <div className="fstt-layout">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <main className="fstt-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
