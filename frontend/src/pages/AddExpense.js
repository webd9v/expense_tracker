import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import CustomAlert from "../components/CustomAlert";
import CategoryDropdown from "../components/CategoryDropdown";

function AddExpense() {
    const [expenseData, setExpenseData] = useState({
        expense_title: "",
        expense_description: "",
        date_occured: "",
        is_paid: false,
        due_date: "",
        category: "",
    });

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setExpenseData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/expenses/add/", {
                // Ensure your endpoint is correct
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenseData),
            });

            if (response.ok) {
                navigate("/"); // Redirect to dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An unexpected error occurred.");
        }
    };

    const handleClear = () => {
        setExpenseData({
            expense_title: "",
            expense_description: "",
            date_occured: "",
            is_paid: false,
            due_date: "",
            category: "",
        });
        setError(null); // Clear any previous errors
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card
                className="bg-light text-white"
                style={{ width: "24rem", height: "28rem" }}
            >
                <Card.Header className="text-center bg-dark">
                    <h3>Add Expense</h3>
                </Card.Header>
                <Card.Body>
                    <CustomAlert
                        show={error}
                        setShow={setError}
                        variant="danger"
                    />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mt-3" controlId="formBasicTitle">
                            <Form.Control
                                type="text"
                                className="border border-secondary"
                                placeholder="Expense Title"
                                name="expense_title"
                                value={expenseData.expense_title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group
                            className="mt-3"
                            controlId="formBasicDescription"
                        >
                            <Form.Control
                                type="text"
                                className="border border-secondary"
                                placeholder="Description"
                                name="expense_description"
                                value={expenseData.expense_description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mt-3" controlId="formBasicODate">
                            <Form.Control
                                type="date"
                                className="border border-secondary"
                                name="date_occured"
                                value={expenseData.date_occured}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="formBasicDDate">
                            <Form.Control
                                type="date"
                                name="due_date"
                                className="border border-secondary"
                                value={expenseData.due_date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="fromCategory">
                            <CategoryDropdown
                                className="border border-secondary"
                                onCategorySelect={handleChange}
                                selectedCategory={expenseData.category}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between mt-3">
                            <Form.Group controlId="isPaidCheckbox">
                                <input
                                    id="checkbox_paid"
                                    type="checkbox"
                                    name="is_paid"
                                    className="btn-check"
                                    checked={expenseData.is_paid}
                                    onChange={handleChange}
                                />
                                <label
                                    className="btn btn-outline-primary"
                                    for="checkbox_paid"
                                >
                                    Is Paid?
                                </label>
                            </Form.Group>
                            <Button variant="danger" onClick={handleClear}>
                                Clear All
                            </Button>
                            <Button variant="success" type="submit">
                                Create Expense
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default AddExpense;
