import React from "react";
import { Navbar as BootstrapNavbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isAuthenticated, onLogout }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        onLogout();
        navigate("/");
    };
    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">
                    Expense Tracker
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/add-expense">
                                Add Expense
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register">
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar;
