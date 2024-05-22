import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmation) {
            setError("Passwords must match.");
            return;
        }

        try {
            const response = await fetch("api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, confirmation }),
            });

            if (response.ok) {
                navigate("/"); // Redirect to dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '24rem', height: '22rem' }}>
                <Card.Header className="text-center">
                    <h3>Sign Up</h3>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>} {/* Display error alert */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mt-2" controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mt-2" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mt-2" controlId="formBasicConfirmation">
                            <Form.Control type="password" placeholder="Confirm Password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100 mt-3" block>
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
                <Card.Footer className="text-center">
                    Already have an account? <Link to="/login">Login!</Link>
                </Card.Footer>
            </Card>
        </div>
    );
}

export default Register;