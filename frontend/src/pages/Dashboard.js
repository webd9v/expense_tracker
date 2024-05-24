import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Expense from "../components/Expense";
import CustomAlert from "../components/CustomAlert";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

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

    const handleLearnMoreClick = (expenseId) => {
        navigate(`/expense/${expenseId}`);
    };

    return (
        <div className="container mt-4">
            <CustomAlert
                show={success}
                setShow={setSuccess}
                variant="success"
            />
            <CustomAlert show={error} setShow={setError} variant="danger" />
            <div className="row">
                {expenses.map((expense) => (
                    <Expense
                        key={expense.expense_id}
                        expense={expense}
                        handleDelete={handleDelete}
                        handleLearnMoreClick={handleLearnMoreClick}
                    />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
