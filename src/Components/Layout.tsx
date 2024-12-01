import React from 'react';
import '../Styles/Home.css';
import Footer from '../Pages/Footer';
import NavBar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div>
      <NavBar/>
      <div className="content" >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;