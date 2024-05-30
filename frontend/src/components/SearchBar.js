import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import CategoryDropdown from "../components/CategoryDropdown";

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filters, setFilters] = useState({
        month: "",
        day: "",
        year: "",
        isPaid: null, // null for all, true/false for specific
    });

    const handleSearch = () => {
        onSearch(searchTerm, { ...filters, category: selectedCategory });
    };

    return (
        <Form className="container mt-4 p-2 rounded">
            <Row>
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Search by title or description"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={2}>
                    <Form.Control
                        type="number"
                        placeholder="Month"
                        min="1"
                        max="12"
                        value={filters.month}
                        onChange={(e) =>
                            setFilters({ ...filters, month: e.target.value })
                        }
                    />
                </Col>
                <Col md={1}>
                    <Form.Control
                        type="number"
                        placeholder="Day"
                        min="1"
                        max="31"
                        value={filters.day}
                        onChange={(e) =>
                            setFilters({ ...filters, day: e.target.value })
                        }
                    />
                </Col>
                <Col md={1}>
                    <Form.Control
                        type="number"
                        placeholder="Year"
                        value={filters.year}
                        onChange={(e) =>
                            setFilters({ ...filters, year: e.target.value })
                        }
                    />
                </Col>
                <Col md={2}>
                    <CategoryDropdown
                        onCategorySelect={setSelectedCategory}
                        selectedCategory={selectedCategory}
                    />
                </Col>
                <Col
                    md={1}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                    }}
                    className="bg-secondary rounded text-white pt-1"
                >
                    <input
                        type="checkbox"
                        style={{
                            width: "16px",
                            height: "16px",
                            margin: "5% 5%",
                        }}
                        checked={filters.isPaid === true}
                        onChange={(e) =>
                            setFilters({ ...filters, isPaid: e.target.checked })
                        }
                    />
                    <label>Paid?</label>
                </Col>
                <Col md={1}>
                    <Button variant="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default SearchBar;
