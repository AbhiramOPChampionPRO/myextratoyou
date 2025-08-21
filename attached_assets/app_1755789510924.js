const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MyExtraToYou API is running' });
});

// In-memory storage (will be replaced with database)
let users = [];
let products = [];
let transactions = [];
let emails = [];
let helpRequests = [];

// Helper to find user by email
function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

// Users endpoints
app.post('/api/users', (req, res) => {
  try {
    const { name, email, password, mobile, state, district, action } = req.body;
    
    console.log('User request:', { action, email, name });
    
    let user = findUserByEmail(email);
    
    if (action === 'login') {
      if (user && user.password === password) {
        res.json({ success: true, user, message: 'Login successful' });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    } else if (action === 'register') {
      if (user) {
        res.json({ success: false, message: 'User already exists' });
      } else {
        user = {
          id: users.length + 1,
          name,
          email,
          password,
          mobile,
          state,
          district,
          stars: 0,
          rejections: 0,
          banned: false,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        res.json({ success: true, user, message: 'Registration successful' });
      }
    }
  } catch (error) {
    console.error('User endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:email', (req, res) => {
  try {
    const { email } = req.params;
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const userIndex = users.findIndex(u => u.id == id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    res.json({ success: true, user: users[userIndex] });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Products endpoints
app.post('/api/products', (req, res) => {
  try {
    const { name, language, topic, price, rating, place, images, sellerId } = req.body;
    
    console.log('Product creation:', { name, sellerId });
    
    const product = {
      id: products.length + 1,
      name,
      language,
      topic,
      price: parseInt(price),
      rating: parseInt(rating),
      place,
      images: Array.isArray(images) ? images : [images],
      sellerId: parseInt(sellerId),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    products.push(product);
    res.json({ success: true, product });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/products', (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get products with seller information
    const productsWithSellers = products
      .filter(product => {
        const seller = users.find(u => u.id === product.sellerId);
        // Hide products from banned sellers or user's own products in marketplace
        return seller && !seller.banned && (!userId || product.sellerId != userId);
      })
      .map(product => {
        const seller = users.find(u => u.id === product.sellerId);
        return {
          ...product,
          seller: seller ? {
            id: seller.id,
            name: seller.name,
            email: seller.email,
            mobile: seller.mobile,
            stars: seller.stars,
            banned: seller.banned
          } : null
        };
      });

    console.log('Products fetch:', { count: productsWithSellers.length, userId });
    res.json({ success: true, products: productsWithSellers });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/products/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const userProducts = products.filter(p => p.sellerId == userId);
    res.json({ success: true, products: userProducts });
  } catch (error) {
    console.error('User products fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const productIndex = products.findIndex(p => p.id == id);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    products[productIndex] = { ...products[productIndex], ...updates, updatedAt: new Date().toISOString() };
    res.json({ success: true, product: products[productIndex] });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const productIndex = products.findIndex(p => p.id == id);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    products.splice(productIndex, 1);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Transaction endpoints
app.post('/api/transactions', (req, res) => {
  try {
    const { productId, sellerId, buyerId, type } = req.body;
    
    console.log('Transaction:', { productId, sellerId, buyerId, type });
    
    const transaction = {
      id: transactions.length + 1,
      productId: parseInt(productId),
      sellerId: parseInt(sellerId),
      buyerId: parseInt(buyerId),
      type, // 'purchase' or 'rejection'
      createdAt: new Date().toISOString()
    };
    
    transactions.push(transaction);
    
    // Update seller stats
    const sellerIndex = users.findIndex(u => u.id == sellerId);
    if (sellerIndex !== -1) {
      if (type === 'purchase') {
        users[sellerIndex].stars = (users[sellerIndex].stars || 0) + 1;
      } else if (type === 'rejection') {
        users[sellerIndex].stars = Math.max(0, (users[sellerIndex].stars || 0) - 1);
        users[sellerIndex].rejections = (users[sellerIndex].rejections || 0) + 1;
        
        // Ban if 5+ rejections
        if (users[sellerIndex].rejections >= 5) {
          users[sellerIndex].banned = true;
          users[sellerIndex].banDate = new Date().toISOString();
        }
      }
    }
    
    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email simulation endpoint
app.post('/api/emails', (req, res) => {
  try {
    const { toEmail, ccEmail, subject, body, type } = req.body;
    
    console.log('Email sent:', { toEmail, ccEmail, subject, type });
    
    const email = {
      id: emails.length + 1,
      toEmail,
      ccEmail,
      subject,
      body,
      type,
      sent: true,
      sentAt: new Date().toISOString()
    };
    
    emails.push(email);
    res.json({ success: true, email });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Help requests endpoint
app.post('/api/help-requests', (req, res) => {
  try {
    const { userId, problemType, problemTitle, problemDetails, userAgent } = req.body;
    
    console.log('Help request:', { problemType, problemTitle });
    
    const helpRequest = {
      id: helpRequests.length + 1,
      userId: userId ? parseInt(userId) : null,
      problemType,
      problemTitle,
      problemDetails,
      userAgent,
      resolved: false,
      createdAt: new Date().toISOString()
    };
    
    helpRequests.push(helpRequest);
    res.json({ success: true, helpRequest });
  } catch (error) {
    console.error('Help request error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoints
app.get('/api/debug/users', (req, res) => {
  res.json({ users: users.length, data: users });
});

app.get('/api/debug/products', (req, res) => {
  res.json({ products: products.length, data: products });
});

app.get('/api/debug/transactions', (req, res) => {
  res.json({ transactions: transactions.length, data: transactions });
});

app.get('/api/debug/emails', (req, res) => {
  res.json({ emails: emails.length, data: emails });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404s
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`MyExtraToYou - BooksForAll server running on port ${port}`);
  console.log('Features available:');
  console.log('- User registration and authentication');
  console.log('- Book donation and marketplace');
  console.log('- Transaction system with email notifications');
  console.log('- User rating and moderation system');
  console.log('- Help system with MCQ support');
});