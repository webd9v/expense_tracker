import React from "react";
import { Card, Button } from "react-bootstrap";

const Expense = ({ expense, handleDelete }) => {
    return (
        <div className="col-md-4 mb-3">
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
    );
};
export default Expense;
