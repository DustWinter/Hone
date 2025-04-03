import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

/**
 * Layout component that provides the common structure for the application
 * Based on FSTT's official website design
 */
const Layout = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="fstt-layout">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="fstt-main-content">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`fstt-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
