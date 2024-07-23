import React from "react";
import { Card, Button } from "react-bootstrap";

const Expense = ({ expense, handleDelete, handleLearnMoreClick }) => {
    const isPaid = expense.is_paid;
    const cardClassName = isPaid ? "bg-success" : "bg-danger";

    return (
        <div className="col-md-4 mb-3">
            <Card className={cardClassName}>
                <Card.Body className="d-flex justify-content-between align-items-start">
                    <div>
                        <Card.Title className="text-white">
                            {expense.expense_title}
                        </Card.Title>
                    </div>
                    {expense.category && (
                        <div
                            style={{
                                fontSize: "0.8em",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                color: "white",
                            }}
                        >
                            {expense.category}
                        </div>
                    )}
                </Card.Body>
                <Card.Footer
                    className="text-white"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        justifyItems: "center",
                    }}
                >
                    <Button
                        variant="primary"
                        className="me-2"
                        style={{ position: "relative", right: "6%" }}
                        onClick={() => handleLearnMoreClick(expense.expense_id)}
                    >
                        Learn More
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleDelete(expense.expense_id)}
                    >
                        Delete Expense
                    </Button>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default Expense;
