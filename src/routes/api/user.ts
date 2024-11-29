import { Router, Request, Response } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nodemailer = require('nodemailer');

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
 * /api/users/register:
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
 * /api/users/login:
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
 * /api/users/favorite/add:
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

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error logging out
 */
router.post('/logout', (req: Request, res: Response) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Return success response
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Error logging out" });
  }
});

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Send a password reset email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Error sending password reset email
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    const {
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_SECURE,

      FRONT_END_URL,
    } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
      return res.status(500).json({ message: "Email not configured" });
    }

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      logger: true,
      debug: true,
    });

    const emailText = `
      You requested a password reset. Please use the following token to reset your password:

      ${FRONT_END_URL}/forgot-password?token=${resetToken}&email=${email}
    `;

    // Send the password reset email
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Error sending password reset email" });
  }
});

/**
 * @swagger
 * /api/users/reset-password:
 *   put:
 *     summary: Reset user password
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
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Error resetting password
 */
router.put('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, password, token } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the reset token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      if (decoded.id !== user._id.toString()) {
        return res.status(400).json({ message: "Invalid token" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update the user's password
    user.password = password; // Password will be hashed by the pre-save hook
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

export default router;