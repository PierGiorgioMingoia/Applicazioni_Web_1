import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
class AppNavbar extends React.Component {
    render() {
        if (!this.props.isLoggedIn) {
            return <Navbar bg="bla">
                <Navbar.Brand href="#home">APP NOLEGGI</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav>
            </Navbar>
        } else {
            return <Navbar bg="light">
                <Navbar.Brand href="#home">APP NOLEGGI</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/user">Home</Nav.Link>
                    <Nav.Link as={Link} to="/" onClick={this.props.userLogout}>Logout</Nav.Link>
                    <Nav.Link as={Link} to="/myPastRentals">My Past Rentals </Nav.Link>
                    <Nav.Link as={Link} to="/myFutureRentals">My Future Rentals</Nav.Link>
                </Nav>
            </Navbar>
        }
    }
}
export { AppNavbar };