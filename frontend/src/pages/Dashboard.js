import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Expense from "../components/Expense";
import CustomAlert from "../components/CustomAlert";
import SearchBar from "../components/SearchBar";
import { Card, Button } from "react-bootstrap";

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

    const handleSearch = async (filters) => {
        try {
            const params = new URLSearchParams({
                search: filters.searchTerm,
                date: filters.date,
                is_paid: filters.isPaid,
                category: filters.selectedCategory,
            });

            const response = await fetch(`/api/expenses/search/?${params}`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setExpenses(data);
            } else {
                setError("Error searching for expenses.");
                setTimeout(() => setError(null), 3000);
            }
        } catch (error) {
            console.error("Error searching for expenses:", error);
            setError("An error occurred while searching.");
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <div className="container mt-4">
            <SearchBar onSearch={handleSearch} />
            <hr />
            <CustomAlert
                show={success}
                setShow={setSuccess}
                variant="success"
            />
            <CustomAlert show={error} setShow={setError} variant="danger" />
            <div className="row mt-3">
                {expenses.map((expense) => (
                    <Expense
                        key={expense.expense_id}
                        expense={expense}
                        handleDelete={handleDelete}
                        handleLearnMoreClick={handleLearnMoreClick}
                    />
                ))}
                <div className="col-md-4 mb-3">
                    <Card
                        className="bg-light p-2 d-flex justify-content-center align-items-center"
                        style={{ height: "100%" }}
                    >
                        <Button
                            className="m-2"
                            variant="secondary"
                            style={{
                                borderRadius: "50%",
                                width: "60px",
                                height: "60px",
                            }}
                            onClick={() => navigate("/add-expense")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                class="bi bi-plus-lg"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                                />
                            </svg>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
