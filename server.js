const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());

// In-memory storage
const receipts = new Map();

// Utility to calculate points
const calculatePoints = (receipt) => {
    let points = 0;

    // Rule: One point for every alphanumeric character in the retailer name
    points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

    // Rule: 50 points if the total is a round dollar amount
    if (parseFloat(receipt.total) % 1 === 0) points += 50;

    // Rule: 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) points += 25;

    // Rule: 5 points for every two items
    points += Math.floor(receipt.items.length / 2) * 5;

    // Rule: Points for item descriptions with lengths as multiples of 3
    receipt.items.forEach(item => {
        const descriptionLength = item.shortDescription.trim().length;
        if (descriptionLength % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    });

    // Rule: 6 points if the day is odd
    const day = parseInt(receipt.purchaseDate.split('-')[2], 10);
    if (day % 2 !== 0) points += 6;

    // Rule: 10 points if the time is between 2:00 PM and 4:00 PM
    const [hour, minute] = receipt.purchaseTime.split(':').map(Number);
    if (hour === 14 || (hour === 15 && minute === 0)) points += 10;

    return points;
};

// POST /receipts/process
app.post('/receipts/process', (req, res) => {
    const receipt = req.body;
    const id = uuidv4();
    const points = calculatePoints(receipt);

    // Store receipt and points in memory
    receipts.set(id, points);

    res.json({ id });
});

// GET /receipts/:id/points
app.get('/receipts/:id/points', (req, res) => {
    const id = req.params.id;
    if (!receipts.has(id)) {
        return res.status(404).json({ error: 'Receipt not found' });
    }

    res.json({ points: receipts.get(id) });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});