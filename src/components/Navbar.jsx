import { Navbar as BootstrapNavbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container className="d-flex justify-content-between">
        <BootstrapNavbar.Brand as={Link} to="/">
          <i className="fas fa-graduation-cap me-2"></i>
          Student Management System
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/">
              <i className="fas fa-home me-1"></i>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/students">
              <i className="fas fa-users me-1"></i>
              Students
            </Nav.Link>
            <Nav.Link as={Link} to="/add-student">
              <i className="fas fa-plus me-1"></i>
              Add Student
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
