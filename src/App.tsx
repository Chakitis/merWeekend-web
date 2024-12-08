import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CSSProperties, useState } from 'react';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Program from './Pages/Program';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import EventLocation from './Pages/EventLocation';
import Layout from './Components/Layout';
import PrivateRoute from './Components/PrivateRoute';
import EventRules from './Pages/EventRules';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const backgroundImageStyle: CSSProperties = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/imghlavicka.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    position: 'relative'
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 2,
    padding: '20px'
  };

  return (
    <div style={backgroundImageStyle}>
      <div style={contentStyle}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/program" element={<Layout><Program /></Layout>} />
            <Route path="/event-location" element={<Layout><EventLocation /></Layout>} />
            <Route path='/event-rules' element={<Layout><EventRules /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/login" element={<Layout><Login setAuth={setIsAuth} /></Layout>} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
