import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import Expense from "../components/Expense";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch("api/expenses/", {
                    headers: {
                        Authorization: `Token ${localStorage.getItem(
                            "authToken"
                        )}`,
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
                    Authorization: `Token ${localStorage.getItem("authToken")}`,
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
                    <Expense
                        key={expense.expense_id}
                        expense={expense}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
