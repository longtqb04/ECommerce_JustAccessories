const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://tranquocbaolong2004:tranquocbaolong2004@justaccessories.qhm1ufh.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    disprice: Number,
    details: String,
    spec: String,
    image: String,
});

const Product = mongoose.model('Product', productSchema);

// API Endpoint to Fetch Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});