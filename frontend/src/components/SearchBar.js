import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import CategoryDropdown from "../components/CategoryDropdown";

function SearchBar({ onSearch }) {
    const [filters, setFilters] = useState({
        searchTerm: "",
        selectedCategory: "",
        date: "",
        isPaid: null, // null for all, true/false for specific
    });

    const handleSearch = () => {
        onSearch({ ...filters });
    };

    return (
        <Form className="container mt-4 p-2 rounded">
            <div className="d-flex flex-column">
                <Row>
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Search by title or description"
                            className="border border-secondary mb-1"
                            value={filters.searchTerm}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    searchTerm: e.target.value,
                                })
                            }
                        />
                    </Col>
                    <Col md={2}>
                        <CategoryDropdown
                            onCategorySelect={(e) =>
                                setFilters({
                                    ...filters,
                                    selectedCategory: e.target.value,
                                })
                            }
                            selectedCategory={filters.selectedCategory}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="date"
                            className="border border-secondary mb-1"
                            value={filters.date}
                            onChange={(e) =>
                                setFilters({ ...filters, date: e.target.value })
                            }
                        />
                    </Col>
                    <Col md={2}>
                        <div
                            className={`btn ${
                                filters.isPaid ? "bg-success" : "bg-secondary"
                            } text-white px-3 d-block`}
                            style={{ borderRadius: "4px" }}
                            onClick={() =>
                                setFilters({
                                    ...filters,
                                    isPaid: !filters.isPaid,
                                })
                            }
                        >
                            {filters.isPaid ? "Paid" : "Not Paid"}
                        </div>
                    </Col>
                </Row>

                <Button
                    variant="primary"
                    onClick={handleSearch}
                    className="mt-1"
                >
                    Search
                </Button>
            </div>
        </Form>
    );
}
export default SearchBar;
