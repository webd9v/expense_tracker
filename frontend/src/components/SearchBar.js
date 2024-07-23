import React, { useState } from "react";
import { Form, Row, div, Button } from "react-bootstrap";
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
        <Form className="mt-4 rounded">
            <div className="container">
                <div
                    className="row d-flex flex-md-column flex-lg-row"
                    style={{ padding: 0, margin: 0 }}
                >
                    <div className="col-lg-6 mb-2" style={{ padding: 2 }}>
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
                    </div>
                    <div className="col-lg-2 mb-2" style={{ padding: 2 }}>
                        <CategoryDropdown
                            onCategorySelect={(e) =>
                                setFilters({
                                    ...filters,
                                    selectedCategory: e.target.value,
                                })
                            }
                            selectedCategory={filters.selectedCategory}
                        />
                    </div>
                    <div className="col-lg-2 mb-2" style={{ padding: 2 }}>
                        <Form.Control
                            type="date"
                            className="border border-secondary mb-1"
                            value={filters.date}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    date: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-lg-2 mb-2" style={{ padding: 2 }}>
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
                    </div>
                </div>
                <div className="row" style={{ margin: 0 }}>
                    <Button
                        variant="primary"
                        onClick={handleSearch}
                        className="mt-1 col-12"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </Form>
    );
}
export default SearchBar;
