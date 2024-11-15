import { Router, Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import Book from '../../models/book.js';
import Review from '../../models/review.js';
import Bookmark from "../../models/bookmark.js";
import ReadingProgress from "../../models/readingProgress.js";

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
 * /api/books:
 *   get:
 *     summary: Retrieve a list of books with pagination, sorting, and filtering
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: title
 *         description: Field to sort the results by
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Case-insensitive search by title
 *     responses:
 *       200:
 *         description: A list of books with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 size:
 *                   type: integer
 *                   description: Number of items per page
 *                 total:
 *                   type: integer
 *                   description: Total number of pages
 *                 totalBooks:
 *                   type: integer
 *                   description: Total number of books
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Error retrieving books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get("/", async (req, res) => {
  try {
    // Retrieve pagination, sorting, and filtering parameters from query
    const {
      page = "1",
      limit = "10",
      sort = "title",
      author,
      genre,
      title,
    }: QueryParams = req.query || {};

    // Build filter criteria
    let query: Record<string, any> = {};
    if (author) {
      query.author = author; // Filter by author
    }
    if (genre) {
      query.genres = genre; // Filter by genre (assuming genre is an ObjectId in the genres array)
    }
    if (title) {
      query.title = { $regex: title, $options: "i" }; // Case-insensitive search by title
    }

    // Convert page and limit to integers
    const pageInt: number = parseInt(page, 10);
    const limitInt: number = parseInt(limit, 10);

    // Query the database with pagination, sorting, and filtering applied
    const books = await Book.find(query)
      .select("-__v -summary -file_page -file_format") // Exclude the __v field from the results
      .sort(sort) // Apply sorting
      .skip((pageInt - 1) * limitInt) // Skip items for pagination
      .limit(limitInt); // Limit the number of items per page

    // Calculate total count and total pages
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limitInt);

    // Return the result with pagination info
    res.json({
      page: pageInt,
      size: limitInt,
      total: totalPages,
      totalBooks,
      books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * @swagger
 * /api/books/:id:
 *   get:
 *     summary: Retrieve a book by ID
 *     description: Retrieve the details of a specific book by its ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the book.
 *     responses:
 *       200:
 *         description: The details of the book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique ID of the book.
 *                 title:
 *                   type: string
 *                   description: The title of the book.
 *                   example: The Great Gatsby
 *                 author:
 *                   type: string
 *                   description: The author of the book.
 *                   example: F. Scott Fitzgerald
 *                 publish_date:
 *                   type: string
 *                   format: date
 *                   description: The publish date of the book.
 *                   example: 1925-04-10
 *                 publisher:
 *                   type: string
 *                   description: The publisher of the book.
 *                   example: Scribner
 *                 cover_image:
 *                   type: string
 *                   description: URL of the cover image of the book.
 *                   example: https://example.com/cover.jpg
 *                 file_page:
 *                   type: string
 *                   description: URL of the book file.
 *                   example: https://example.com/book.pdf
 *                 file_format:
 *                   type: string
 *                   description: The format of the book file.
 *                   enum: [epub, pdf, mobi]
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the genre.
 *                       name:
 *                         type: string
 *                         description: The name of the genre.
 *                       description:
 *                         type: string
 *                         description: The description of the genre.
 *                   description: List of genres associated with the book.
 *                 summary:
 *                   type: string
 *                   description: Summary of the book's content.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the book was created.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the book was last updated.
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Book not found
 *       500:
 *         description: Error retrieving book details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Error retrieving book details
 */
router.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    // Find the book by ID
    const book = await Book.findById(req.params.id).select("-__v").populate(
      "genres",
      "name description"
    );

    // If book not found, return a 404 response
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Return the found book details
    res.json(book);
  } catch (error) {
    console.error("Error retrieving book details:", error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

/**
 * @swagger
 * /api/books/:book_id/reviews:
 *   get:
 *     summary: Retrieve reviews for a specific book
 *     description: Retrieve a paginated and sorted list of reviews for a specific book.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the book.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: desc
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: A paginated list of reviews for the book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                 size:
 *                   type: integer
 *                   description: Number of items per page.
 *                 total:
 *                   type: integer
 *                   description: Total number of pages.
 *                 totalReviews:
 *                   type: integer
 *                   description: Total number of reviews for the book.
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the review.
 *                       rating:
 *                         type: integer
 *                         description: Rating given by the reviewer.
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         description: Comment provided by the reviewer.
 *                         example: Excellent book!
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the review was created.
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Book not found
 *       500:
 *         description: Error retrieving reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Error retrieving reviews
 */
router.get("/:book_id/reviews", async (req, res) => {
  try {
    // Retrieve pagination and sorting parameters from query
    const { page = "1", size = "10", sort = "desc" }: QueryParams = req.query;

    // Convert page and limit to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(size);

    // Define sort order based on query parameter (default is descending by creation date)
    const sortOrder = sort === "asc" ? 1 : -1;

    // Query the database for reviews for a specific book
    const reviews = await Review.find({ book_id: req.params.book_id })
      .select("-__v -book_id -user_id") // Exclude the __v field from the results
      .sort({ created_at: sortOrder }) // Sort by creation date
      .skip((pageInt - 1) * limitInt) // Skip items for pagination
      .limit(limitInt); // Limit the number of items per page

    // Calculate the total number of reviews for the book
    const totalReviews = await Review.countDocuments({
      book_id: req.params.book_id,
    });
    const totalPages = Math.ceil(totalReviews / limitInt);

    // Return the paginated and sorted review list
    res.json({
      page: pageInt,
      size: limitInt,
      total: totalPages,
      totalReviews,
      reviews,
    });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ message: "Error retrieving reviews" });
  }
});

/**
 * @swagger
 * /api/books/:book_id/bookmarks:
 *   get:
 *     summary: Retrieve a list of bookmarks for a specific book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: The sort order (ascending or descending)
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: created_at
 *         description: The field to sort by (created_at or page_number)
 *     responses:
 *       200:
 *         description: A list of bookmarks
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
 *                 totalBookmarks:
 *                   type: integer
 *                 bookmarks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bookmark'
 *       500:
 *         description: Error retrieving bookmarks
 */
router.get("/:book_id/bookmarks", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Retrieve query parameters for pagination and sorting
    const {
      page = "1",
      size = "10",
      sort = "desc",
      sort_by = "created_at", // Default sorting by creation date
    }: QueryParams = req.query;

    // Convert page and limit to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(size);

    // Define sort order based on query parameter (default is descending)
    const sortOrder = sort === "asc" ? 1 : -1;

    // Build query to filter by user_id and book_id
    const query = {
      user_id: req.user?.id,
      book_id: req.params.book_id,
    };

    // Query the database with filters, pagination, and sorting
    const bookmarks = await Bookmark.find(query)
      .sort({ [sort_by]: sortOrder }) // Sort by specified field (created_at or page_number)
      .skip((pageInt - 1) * limitInt) // Skip items for pagination
      .limit(limitInt); // Limit the number of items per page

    // Calculate the total number of bookmarks matching the query
    const totalBookmarks = await Bookmark.countDocuments(query);
    const totalPages = Math.ceil(totalBookmarks / limitInt);

    // Return the paginated and sorted bookmark list
    res.json({
      page: pageInt,
      size: limitInt,
      total: totalPages,
      totalBookmarks,
      bookmarks,
    });
  } catch (error) {
    console.error("Error retrieving bookmarks:", error);
    res.status(500).json({ message: "Error retrieving bookmarks" });
  }
});

/**
 * @swagger
 * /api/books/:book_id/reading-progress:
 *   get:
 *     summary: Retrieve reading progress for a specific book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book
 *     responses:
 *       200:
 *         description: Reading progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 readingProgress:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique ID of the reading progress
 *                     book_id:
 *                       type: string
 *                       description: The ID of the book
 *                     user_id:
 *                       type: string
 *                       description: The ID of the user
 *                     current_page:
 *                       type: integer
 *                       description: The current page the user is on
 *                     total_pages:
 *                       type: integer
 *                       description: The total number of pages in the book
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the reading progress was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the reading progress was last updated
 *       404:
 *         description: Reading progress not found for this book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Reading progress not found for this book
 *       500:
 *         description: Error retrieving reading progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Error retrieving reading progress
 */
router.get("/:book_id/reading-progress", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Find the reading progress by bookId and userId
    const readingProgress = await ReadingProgress.findOne({
      book_id: req.params.book_id,
      user_id: req.user?.id,
    });

    if (!readingProgress) {
      return res
        .status(404)
        .json({ message: "Reading progress not found for this book" });
    }

    // Return the reading progress
    res.json({
      message: "Reading progress retrieved successfully",
      readingProgress,
    });
  } catch (error) {
    console.error("Error retrieving reading progress:", error);
    res.status(500).json({ message: "Error retrieving reading progress" });
  }
});

export default router;
