import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CSSProperties, useState } from 'react';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Program from './Pages/Program';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Layout from './Components/Layout';
import PrivateRoute from './Components/PrivateRoute';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  
  const backgroundImageStyle: CSSProperties = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/imghlavicka.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
    position: 'relative'
  };

  return (
    <div style={backgroundImageStyle}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/program" element={<Layout><Program/></Layout> } />
        <Route path="/contact" element={<Layout><Contact/></Layout> } />
        <Route path="/login" element={<Layout><Login setAuth={setIsAuth}/> </Layout>} />
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
  );
};

export default App;