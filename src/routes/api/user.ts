import { Router, Request, Response } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";

import User from '../../models/user.js';
import Book from '../../models/book.js';

import { authenticateToken } from '../../middlewares/authentication.js';
import { JWT_SECRET } from '../../admin/constants.js';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string } | JwtPayload;
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and login
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Username or email already exists
 *       500:
 *         description: Error registering user
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Error logging in
 */

/**
 * @swagger
 * /favorite/add:
 *   put:
 *     summary: Add a book to user's favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *             properties:
 *               book_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Book is already in favorites
 *       404:
 *         description: Book or user not found
 *       500:
 *         description: Error adding book to favorites
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create a new user instance with data from the request body
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // Password will be hashed by the pre-save hook
      role: "user",
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return a success message and the registered user's data
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        created_at: savedUser.created_at,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log(req);
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Set the JWT as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      sameSite: "strict", // Prevent CSRF by limiting cross-site requests
    });

    // Return success response
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

router.put('/favorite/add', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { book_id } = req.body;
    const { id } = req.user as { id: string };
    // Check if the book exists in the database
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find the user and add the book to their favorites
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the book is already in the user's favorites
    if (user.favorites.includes(book_id)) {
      return res.status(400).json({ message: "Book is already in favorites" });
    }

    // Add the book to the favorites list
    user.favorites.push(book_id);
    await user.save();

    // Return the updated user data
    res.json({
      message: "Book added to favorites successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error adding book to favorites:", error);
    res.status(500).json({ message: "Error adding book to favorites" });
  }
});

export default router;