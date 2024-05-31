import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import CustomAlert from "../components/CustomAlert";
import { CsrfContext } from "../context/csrf";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);
    const csrfToken = useContext(CsrfContext);

    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication status on initial load (e.g., fetch from local storage or API)
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!csrfToken) {
            setError("CSRF token not available. Please try again.");
            return;
        }
        try {
            const response = await fetch("api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(data.token);
                navigate("/"); // Redirect to the dashboard
            } else {
                // Handle login error
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "20rem", height: "18rem" }}>
                <Card.Header className="text-center">
                    <h3>Login</h3>
                </Card.Header>
                <Card.Body>
                    <CustomAlert
                        show={error}
                        setShow={setError}
                        variant="danger"
                    />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mt-2" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group
                            className="mt-2"
                            controlId="formBasicPassword"
                        >
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="success"
                            type="submit"
                            className="w-100 mt-3"
                            block
                        >
                            Login
                        </Button>
                    </Form>
                </Card.Body>
                <Card.Footer className="text-center">
                    Don't have an account? <Link to="/register">Sign up!</Link>
                </Card.Footer>
            </Card>
        </div>
    );
}

export default Login;
