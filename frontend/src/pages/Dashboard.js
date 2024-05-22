import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch("api/expenses/", {
                    headers: {
                        "Authorization": `Token ${localStorage.getItem("authToken")}`, 
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
                } else {
                    // Handle error (e.g., display an error message)
                }
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };
        fetchExpenses();
    }, [success]); 

    const handleDelete = async (expenseId) => {
        try {
            const response = await fetch(`api/delete_expense/${expenseId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${localStorage.getItem("authToken")}`, 
                },
            });

            if (response.ok) {
                setSuccess("Expense deleted successfully!");
                setTimeout(() => setSuccess(null), 3000); // Clear success message
            } else {
                setError("Failed to delete expense.");
                setTimeout(() => setError(null), 3000); // Clear error message
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    return (
        <div className="container mt-4">
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="row">
                {expenses.map((expense) => (
                    <div key={expense.expense_id} className="col-md-4 mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{expense.expense_title}</Card.Title>
                                <Card.Text>
                                    Is Paid: {expense.is_paid ? "Yes" : "No"}
                                </Card.Text>
                                <Button variant="primary" className="me-2">
                                    Learn More
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(expense.expense_id)}
                                >
                                    Delete Expense
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;