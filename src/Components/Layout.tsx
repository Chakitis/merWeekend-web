import React, { useEffect } from 'react';
import '../Styles/Home.css';
import Footer from '../Pages/Footer';
import NavBar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const header = document.querySelector('.navbar');
    const content = document.querySelector('.content');
    if (header && content) {
      const headerHeight = header.clientHeight;
      (content as HTMLElement).style.paddingTop = `${headerHeight}px`;
    }
  }, []);

  return (
    <div className="layout">
      <NavBar />
      <div className="content">
        <div className="container">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;