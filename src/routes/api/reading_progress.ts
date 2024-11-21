import { Router, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import Book from '../../models/book.js';
import ReadingProgress from '../../models/readingProgress.js';
import { authenticateToken } from "../../middlewares/authentication.js";

const router = Router();

interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  sort_by?: string;
  size?: string;
  author?: string;
  genre?: string;
  title?: string;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string } | JwtPayload;
}

/**
 * @swagger
 * /api/reading_progress:
 *   get:
 *     summary: Retrieve a list of reading progress records
 *     tags: [ReadingProgress]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *         description: Field to sort by (started_at, finished_at, progress)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by book title
 *     responses:
 *       200:
 *         description: A list of reading progress records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 size:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalRecords:
 *                   type: integer
 *                 readingProgressRecords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       book_id:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           cover_image:
 *                             type: string
 *                       progress:
 *                         type: number
 *                       started_at:
 *                         type: string
 *                         format: date-time
 *                       finished_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error retrieving reading progress records
 */
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Retrieve query parameters for pagination, sorting, and search
    const {
      page = "1",
      size = "10",
      sort_by = "started_at", // Default sorting by started_at
      sort = "desc",
      title,
    }: QueryParams = req.query;

    // Convert page and limit to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(size);

    // Define sort order based on query parameter (default is descending)
    const sortOrder = sort === "asc" ? 1 : -1;

    // Build query for searching book titles if provided
    let bookQuery: Record<string, any> = {};
    if (title) {
      bookQuery.title = { $regex: title, $options: "i" }; // Case-insensitive search by title
    }

    // Find books matching the search criteria
    const books = await Book.find(bookQuery).select("_id title");
    const bookIds = books.map((book) => book._id);

    // Build query to filter reading progress for the user and matching books
    const readingProgressQuery = {
      user_id: req.user?.id,
      book_id: { $in: bookIds },
    };

    // Query the database with filters, pagination, and sorting
    const readingProgressRecords = await ReadingProgress.find(
      readingProgressQuery
    )
      .populate("book_id", "title cover_image") // Populate book title
      .sort({ [sort_by]: sortOrder }) // Sort by specified field (started_at, finished_at, progress)
      .skip((pageInt - 1) * limitInt) // Skip items for pagination
      .limit(limitInt); // Limit the number of items per page

    // Calculate the total number of matching reading progress records
    const totalRecords = await ReadingProgress.countDocuments(
      readingProgressQuery
    );
    const totalPages = Math.ceil(totalRecords / limitInt);

    // Return the paginated and sorted reading progress list with book titles
    res.json({
      page: pageInt,
      size: limitInt,
      total: totalPages,
      totalRecords,
      readingProgressRecords,
    });
  } catch (error) {
    console.error("Error retrieving reading progress records:", error);
    res
      .status(500)
      .json({ message: "Error retrieving reading progress records" });
  }
});

/**
 * @swagger
 * /api/reading_progress/add:
 *   post:
 *     summary: Add a new reading progress record
 *     tags: [ReadingProgress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *                 description: ID of the book
 *               progress:
 *                 type: number
 *                 description: Reading progress percentage
 *     responses:
 *       201:
 *         description: Reading progress added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 readingProgress:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     book_id:
 *                       type: string
 *                     progress:
 *                       type: number
 *                     started_at:
 *                       type: string
 *                       format: date-time
 *                     finished_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Reading progress for this book already exists
 *       500:
 *         description: Error adding reading progress
 */
router.post("/add", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { book_id, progress } = req.body;

    // Check if the book exists in the database
    const existingBook = await Book.findById(book_id);
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if a reading progress record already exists for this user and book
    const existingProgress = await ReadingProgress.findOne({
      user_id: req.user?.id,
      book_id,
    });
    if (existingProgress) {
      return res.status(400).json({
        message: "Reading progress for this book already exists",
      });
    }

    // Create a new reading progress instance
    const newReadingProgress = new ReadingProgress({
      user_id: req.user?.id, // Retrieve user ID from authenticated user
      book_id,
      progress,
    });

    // Save the reading progress to the database
    const savedProgress = await newReadingProgress.save();

    // Return the saved reading progress as the response
    res.status(201).json({
      message: "Reading progress added successfully",
      readingProgress: savedProgress,
    });
  } catch (error) {
    console.error("Error adding reading progress:", error);
    res.status(500).json({ message: "Error adding reading progress" });
  }
});

/**
 * @swagger
 * /api/reading_progress/:id:
 *   put:
 *     summary: Update an existing reading progress record
 *     tags: [ReadingProgress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reading progress ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: number
 *                 description: Updated reading progress percentage
 *     responses:
 *       200:
 *         description: Reading progress updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 readingProgress:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     book_id:
 *                       type: string
 *                     progress:
 *                       type: number
 *                     started_at:
 *                       type: string
 *                       format: date-time
 *                     finished_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Reading progress not found or unauthorized
 *       500:
 *         description: Error updating reading progress
 */
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { progress } = req.body;

    // Find the reading progress by ID and ensure it belongs to the logged-in user
    const readingProgress = await ReadingProgress.findById(req.params.id);
    if (!readingProgress) {
      return res
        .status(404)
        .json({ message: "Reading progress not found or unauthorized" });
    }

    // Check if the reading progress is already completed
    if (readingProgress.progress === 100) {
      return res.json({ message: "Reading progress is already completed" });
    }

    // Check if the user is authorized to update this reading progress
    if (readingProgress.user_id.toString() !== req.user?.id) {
      return res
        .status(404)
        .json({ message: "unauthorized to update this reading progress" });
    }

    // Update the progress and optionally the finished_at date
    if (progress !== undefined) {
      readingProgress.progress = progress;
    }

    // Update the `updated_at` timestamp
    readingProgress.updated_at = new Date(Date.now());

    // Save the updated reading progress
    const updatedProgress = await readingProgress.save();

    // Return the updated reading progress as the response
    res.json({
      message: "Reading progress updated successfully",
      readingProgress: updatedProgress,
    });
  } catch (error) {
    console.error("Error updating reading progress:", error);
    res.status(500).json({ message: "Error updating reading progress" });
  }
});

/**
 * @swagger
 * /api/reading_progress/:id:
 *   delete:
 *     summary: Delete a reading progress record
 *     tags: [ReadingProgress]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reading progress ID
 *     responses:
 *       200:
 *         description: Reading progress deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Reading progress not found or unauthorized
 *       500:
 *         description: Error deleting reading progress
 */
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Find the reading progress by ID and ensure it belongs to the logged-in user
    const readingProgress = await ReadingProgress.findById(req.params.id);
    if (!readingProgress) {
      return res
        .status(404)
        .json({ message: "Reading progress not found or unauthorized" });
    }

    // Check if the user is authorized to delete this reading progress
    if (readingProgress.user_id.toString() !== req.user?.id) {
      return res
        .status(404)
        .json({ message: "unauthorized to delete this reading progress" });
    }

    // Delete the reading progress record
    await ReadingProgress.findByIdAndDelete(req.params.id);

    // Return a success message
    res.json({ message: "Reading progress deleted successfully" });
  } catch (error) {
    console.error("Error deleting reading progress:", error);
    res.status(500).json({ message: "Error deleting reading progress" });
  }
});

module.exports = router;
