const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://tranquocbaolong2004:nartkram04@justaccessories.qhm1ufh.mongodb.net/JustAccessories?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Product Schema
const productSchema = new mongoose.Schema({
    _id: String,
    name: String,
    category: String,
    price: Number,
    disprice: Number,
    details: String,
    spec: String,
    imageurl: String,
    code: Number,
});

const reviewSchema = new mongoose.Schema({
    productCode: Number,
    username: String,
    email: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

const Product = mongoose.model('Product', productSchema);

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/products/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to count products' });
    }
});


app.get('/api/products/code/:code', async (req, res) => {
    try {
        const product = await Product.findOne({ code: req.params.code });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

app.get('/api/products/search/:q', async (req, res) => {
    try {
        const searchQuery = req.params.q;
        
        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        
        const products = await Product.find({ name: { $regex: searchQuery, $options: 'i' } });
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to search products' });
    }
});

app.get('/api/products/recommend/:code', async (req, res) => {
    try {
        const product = await Product.findOne({ code: req.params.code });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const recommendedProducts = await Product.find({
            category: product.category,
        });

        res.json(recommendedProducts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

app.get('/api/reviews/all', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});


app.get('/api/reviews/:productCode', async (req, res) => {
    try {
        const reviews = await Review.find({ productCode: req.params.productCode });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

app.post('/api/reviews', async (req, res) => {
    try {
        const { productCode, username, rating, comment } = req.body;

        if (!productCode || !username || !rating || !comment) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newReview = new Review({ productCode, username, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add review' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});