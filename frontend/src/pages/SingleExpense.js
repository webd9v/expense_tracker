import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import CustomAlert from "../components/CustomAlert";

function SingleExpense() {
    const { id } = useParams();
    const [expense, setExpense] = useState(null);
    const [error, setError] = useState(null);
    const [loadingAlert, setLoadingAlert] = useState(null);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                setLoadingAlert("Loading...");
                const response = await fetch(`/api/expenses/${id}/`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                });
                setLoadingAlert(null);
                if (response.ok) {
                    const data = await response.json();
                    setExpense(data);
                } else {
                    setError("Failed to fetch expense details.");
                }
            } catch (error) {
                console.error("Error fetching expense details:", error);
                setLoadingAlert(null);
                setError("An error occurred while fetching expense details.");
            }
        };

        fetchExpense();
    }, [id]);

    return (
        <div className="container mt-4">
            <CustomAlert show={error} setShow={setError} variant="danger" />
            {!expense && !error && (
                <CustomAlert
                    show={loadingAlert}
                    setShow={setLoadingAlert}
                    variant="info"
                />
            )}
            {expense && (
                <Card>
                    <Card.Body>
                        <Button variant="primary" className="float-end">
                            Category: {expense.category || "Not Specified!"}
                        </Button>
                        <Card.Title>{expense.expense_title}</Card.Title>
                        <Card.Text>
                            Description:{" "}
                            {expense.expense_description ||
                                "No Description was enterred!"}
                        </Card.Text>
                        <Card.Text>
                            Is Paid: {expense.is_paid ? "Yes" : "No"}
                        </Card.Text>
                        <Card.Text>
                            Date Occurred: {expense.date_occured}
                        </Card.Text>
                        {expense.due_date && (
                            <Card.Text>Due Date: {expense.due_date}</Card.Text>
                        )}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}

export default SingleExpense;
