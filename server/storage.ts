import { type User, type InsertUser, type Book, type InsertBook, type Transaction, type InsertTransaction, type HelpRequest, type InsertHelpRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Book methods
  getBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book | undefined>;
  getBooksBySeller(sellerId: string): Promise<Book[]>;
  createBook(book: InsertBook & { sellerId: string }): Promise<Book>;
  updateBook(id: string, updates: Partial<Book>): Promise<Book | undefined>;

  // Transaction methods
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined>;

  // Help request methods
  createHelpRequest(helpRequest: InsertHelpRequest & { userId: string }): Promise<HelpRequest>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private books: Map<string, Book>;
  private transactions: Map<string, Transaction>;
  private helpRequests: Map<string, HelpRequest>;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.transactions = new Map();
    this.helpRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      stars: 0,
      rejections: 0,
      isBanned: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getBooks(): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => book.isAvailable);
  }

  async getBookById(id: string): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async getBooksBySeller(sellerId: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(book => book.sellerId === sellerId);
  }

  async createBook(bookData: InsertBook & { sellerId: string }): Promise<Book> {
    const id = randomUUID();
    const book: Book = {
      ...bookData,
      images: bookData.images || [],
      id,
      isAvailable: true,
      createdAt: new Date(),
    };
    this.books.set(id, book);
    return book;
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;

    const updatedBook = { ...book, ...updates };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.buyerId === userId || transaction.sellerId === userId
    );
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...transactionData,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async createHelpRequest(helpRequestData: InsertHelpRequest & { userId: string }): Promise<HelpRequest> {
    const id = randomUUID();
    const helpRequest: HelpRequest = {
      ...helpRequestData,
      id,
      status: "open",
      createdAt: new Date(),
    };
    this.helpRequests.set(id, helpRequest);
    return helpRequest;
  }
}

export const storage = new MemStorage();
