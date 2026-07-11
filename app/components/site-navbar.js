import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';

function SiteNavbar() {
  return (
    <Navbar bg="white" expand="md" className="border-bottom sticky-top">
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand className="fw-semibold">RC4Conferences</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="site-navbar-nav" />
        <Navbar.Collapse id="site-navbar-nav">
          <Nav className="ms-auto gap-md-3">
            <Link href="/" passHref legacyBehavior>
              <Nav.Link>Home</Nav.Link>
            </Link>
            <Link href="/conferences" passHref legacyBehavior>
              <Nav.Link>Events</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteNavbar;
