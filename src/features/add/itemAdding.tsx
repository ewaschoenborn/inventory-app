import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container } from 'react-bootstrap';

const ItemAdding = () => {
    const navigate = useNavigate();

    const [newItem, setNewItem] = useState({
        name: '',
        id: '',
        damageLevel: '',
        location: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Save to DB here
        console.log('New Item:', newItem);

        // Redirect back to overview
        navigate('/overview');
    };

    return (
        <Container className="py-4">
            <h2>Add New Item</h2>
            <Form>
                <Form.Group className="mb-3" controlId="itemName">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter item name"
                        name="name"
                        value={newItem.name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="itemId">
                    <Form.Label>Item ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter item ID"
                        name="id"
                        value={newItem.id}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="damageLevel">
                    <Form.Label>Damage Level</Form.Label>
                    <Form.Select name="damageLevel" value={newItem.damageLevel} onChange={handleChange}>
                        <option value="">Select damage level</option>
                        <option value="None">None</option>
                        <option value="Minor">Minor</option>
                        <option value="Major">Major</option>
                        <option value="Total">Total</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter location"
                        name="location"
                        value={newItem.location}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="secondary" className="me-2" onClick={() => navigate('/overview')}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Item
                </Button>
            </Form>
        </Container>
    );
};

export default ItemAdding;
