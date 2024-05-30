import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

function CategoryDropdown({ onCategorySelect, selectedCategory }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories/", {
                    headers: {
                        Authorization: `Token ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    // Handle error if categories couldn't be fetched
                    console.error("Failed to fetch categories.");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Form.Group controlId="categorySelect">
            <Form.Control
                as="select"
                className="border border-secondary"
                value={selectedCategory || ""}
                onChange={(e) => onCategorySelect(e.target.value)}
            >
                <option value="">All Categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.category_name}>
                        {category.category_name}
                    </option>
                ))}
            </Form.Control>
        </Form.Group>
    );
}

export default CategoryDropdown;
