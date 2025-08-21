import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { insertUserSchema, insertBookSchema, insertTransactionSchema, insertHelpRequestSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Don't send password in response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (user.isBanned) {
        return res.status(403).json({ message: "Account temporarily banned due to multiple rejections" });
      }
      
      // Don't send password in response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const updates = req.body;
      
      // Don't allow updating sensitive fields
      delete updates.id;
      delete updates.password;
      delete updates.stars;
      delete updates.rejections;
      delete updates.isBanned;
      delete updates.createdAt;
      
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });

  // Book routes - using JSON file storage
  app.get("/api/books", async (req, res) => {
    try {
      const booksPath = join(process.cwd(), 'data', 'book.json');
      let books = [];
      
      try {
        const booksData = readFileSync(booksPath, 'utf-8');
        books = JSON.parse(booksData);
      } catch (err) {
        // If file doesn't exist or is empty, return empty array
        books = [];
      }
      
      // Only return available books
      const availableBooks = books.filter((book: any) => book.status === 'available');
      res.json(availableBooks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get books", error });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const {
        title,
        author,
        category,
        condition,
        description,
        price,
        donatedBy,
        donorEmail,
        donorPhone,
        location,
        image
      } = req.body;
      
      // Validate required fields
      if (!title || !author || !category || !condition || !price || !donatedBy || !donorEmail || !donorPhone) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Validate price
      if (price >= 400) {
        return res.status(400).json({ message: "Price must be less than ₹400" });
      }
      
      // Create new book object
      const newBook = {
        id: randomUUID(),
        title,
        author,
        category,
        condition,
        description: description || '',
        price,
        donatedBy,
        donorEmail,
        donorPhone,
        location,
        dateAdded: new Date().toISOString(),
        status: 'available',
        image: image || null
      };
      
      // Read existing books
      const booksPath = join(process.cwd(), 'data', 'book.json');
      let books = [];
      
      try {
        const booksData = readFileSync(booksPath, 'utf-8');
        books = JSON.parse(booksData);
      } catch (err) {
        // If file doesn't exist, start with empty array
        books = [];
      }
      
      // Add new book
      books.push(newBook);
      
      // Write back to file
      writeFileSync(booksPath, JSON.stringify(books, null, 2));
      
      res.status(201).json({ message: "Book donated successfully!", book: newBook });
    } catch (error) {
      console.error('Book donation error:', error);
      res.status(400).json({ message: "Failed to donate book", error });
    }
  });

  app.get("/api/books/seller/:sellerId", async (req, res) => {
    try {
      const books = await storage.getBooksBySeller(req.params.sellerId);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to get seller books", error });
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      const book = await storage.getBookById(transactionData.bookId);
      if (!book || !book.isAvailable) {
        return res.status(404).json({ message: "Book not found or not available" });
      }
      
      const buyer = await storage.getUser(transactionData.buyerId);
      const seller = await storage.getUser(transactionData.sellerId);
      
      if (!buyer || !seller) {
        return res.status(404).json({ message: "Buyer or seller not found" });
      }
      
      const transaction = await storage.createTransaction(transactionData);
      
      // Here you would typically send email notifications
      console.log(`Purchase request: ${buyer.name} wants to buy "${book.name}" from ${seller.name}`);
      
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data", error });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const { status } = req.body;
      
      const transaction = await storage.updateTransaction(req.params.id, { status });
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      // Update seller rating based on transaction status
      if (status === "completed") {
        const seller = await storage.getUser(transaction.sellerId);
        if (seller) {
          await storage.updateUser(seller.id, {
            stars: seller.stars + 1,
          });
        }
        
        // Mark book as unavailable
        await storage.updateBook(transaction.bookId, { isAvailable: false });
      } else if (status === "rejected") {
        const seller = await storage.getUser(transaction.sellerId);
        if (seller) {
          const newRejections = seller.rejections + 1;
          const isBanned = newRejections >= 5;
          
          await storage.updateUser(seller.id, {
            stars: Math.max(0, seller.stars - 1),
            rejections: newRejections,
            isBanned,
          });
        }
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction", error });
    }
  });

  app.get("/api/transactions/user/:userId", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions", error });
    }
  });

  // Book request routes
  app.post("/api/requests", async (req, res) => {
    try {
      const {
        bookId,
        bookTitle,
        requestorName,
        requestorEmail,
        requestorPhone,
        requestorMessage
      } = req.body;
      
      // Validate required fields
      if (!bookId || !bookTitle || !requestorName || !requestorEmail) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Create new request object
      const newRequest = {
        request_id: randomUUID(),
        book_id: bookId,
        book_title: bookTitle,
        requestor_name: requestorName,
        requestor_email_id: requestorEmail,
        requestor_phone_number: requestorPhone || "",
        requestor_message: requestorMessage || "",
        requested_on: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', '')
      };
      
      // Read existing requests
      const requestsPath = join(process.cwd(), 'data', 'request.json');
      let requests = [];
      
      try {
        const requestsData = readFileSync(requestsPath, 'utf-8');
        requests = JSON.parse(requestsData);
      } catch (err) {
        // If file doesn't exist, start with empty array
        requests = [];
      }
      
      // Add new request
      requests.push(newRequest);
      
      // Write back to file
      writeFileSync(requestsPath, JSON.stringify(requests, null, 2));
      
      res.status(201).json({ message: "Request sent successfully!", request: newRequest });
    } catch (error) {
      console.error('Book request error:', error);
      res.status(400).json({ message: "Failed to send request", error });
    }
  });

  // Help request routes
  app.post("/api/help", async (req, res) => {
    try {
      const helpData = insertHelpRequestSchema.parse(req.body);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const helpRequest = await storage.createHelpRequest({
        ...helpData,
        userId,
      });
      
      // Here you would typically send email notification
      console.log(`Help request submitted: ${helpData.subject} by user ${userId}`);
      
      res.status(201).json(helpRequest);
    } catch (error) {
      res.status(400).json({ message: "Invalid help request data", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
