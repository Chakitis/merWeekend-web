import { Navbar, Container, Nav } from "react-bootstrap";
import '../Styles/Home.css'; 

const NavBar = () => {
  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/"><img src={`${process.env.PUBLIC_URL}/images/logoBold.png`} alt="Logo" className="logoNB" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto custom-nav">
            <Nav.Link href="/" className="custom-nav-link">Domů</Nav.Link>
            <Nav.Link href="/about" className="custom-nav-link">O MerWeekend</Nav.Link>
            <Nav.Link href="/program" className="custom-nav-link">Program</Nav.Link>
            <Nav.Link href="/event-location" className="custom-nav-link">Místo konání</Nav.Link>
            <Nav.Link href="/event-rules" className="custom-nav-link">Pravidla</Nav.Link>
            <Nav.Link href="/contact" className="custom-nav-link">Kontakt</Nav.Link>
            <Nav.Link href="/login" className="custom-nav-link">Přihlášení</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;