import { Router } from 'express';

const router = Router();

import Book from '../../../models/book.js';
import Genre from '../../../models/genre.js';

/**
 * @swagger
 * /api/page/home:
 *   get:
 *     summary: Retrieve homepage data
 *     tags: [Homepage]
 *     description: Fetch the latest books and popular genres with books under each genre.
 *     responses:
 *       200:
 *         description: A JSON object containing the latest books and genres with books.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 latestBooks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       cover_image:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       books:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             title:
 *                               type: string
 *                             author:
 *                               type: string
 *                             cover_image:
 *                               type: string
 *       500:
 *         description: Error fetching homepage data
 */
router.get("/home", async (req, res) => {
  try {
    // Fetch latest books (e.g., limit to 10)
    const latestBooks = await Book.find()
      .sort({ created_at: -1 })
      .limit(10)
      .select("_id title author cover_image created_at");

    // Fetch popular genres with books under each genre
    const genres = await Genre.find().limit(5); // Limit to 5 popular genres
    const genreData = await Promise.all(
      genres.map(async (genre) => {
        // Fetch books under each genre (e.g., limit to 3 books per genre)
        const books = await Book.find({ genres: genre._id })
          .limit(3)
          .select("_id title author cover_image");
        return {
          _id: genre._id,
          name: genre.name,
          books,
        };
      })
    );

    // Return the homepage data
    res.json({
      latestBooks,
      genres: genreData,
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.status(500).json({ message: "Error fetching homepage data" });
  }
});

export default router;
