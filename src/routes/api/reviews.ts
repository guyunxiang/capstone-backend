import { Router, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import Review from '../../models/review.js';
import { authenticateToken } from "../../middlewares/authentication.js";

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string } | JwtPayload;
}
/**
 * @swagger
 * /api/reviews/add:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Rating of the book
 *               comment:
 *                 type: string
 *                 description: Comment about the book
 *               book_id:
 *                 type: string
 *                 description: ID of the book being reviewed
 *             example:
 *               rating: 5
 *               comment: "Great book!"
 *               book_id: "60c72b2f9b1d8e001c8e4b8a"
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       400:
 *         description: User has already reviewed this book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error adding review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/add", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { rating, comment, book_id } = req.body;

    // Check if the user has already added a review for this book
    const existingReview = await Review.findOne({
      book_id: book_id,
      user_id: req.user?.id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this book",
      });
    }

    // Create a new review instance
    const newReview = new Review({
      rating,
      comment,
      book_id,
      user_id: req.user?.id,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    // Return the saved review as the response
    res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review" });
  }
});


/**
 * @swagger
 * /api/reviews/:id:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Rating of the book
 *               comment:
 *                 type: string
 *                 description: Comment about the book
 *             example:
 *               rating: 4
 *               comment: "Updated comment"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Unauthorized to edit this review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error updating review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Find the review by ID
    const review = await Review.findById(req.params.id);

    // Check if the review exists
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the review belongs to the logged-in user
    if (review.user_id.toString() !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this review" });
    }

    // Update the review fields
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    review.updated_at = new Date(Date.now()); // Update the `updated_at` timestamp

    // Save the updated review
    const updatedReview = await review.save();

    // Return the updated review
    res.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Error updating review" });
  }
});

/**
 * @swagger
 * /api/reviews/:id:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Unauthorized to delete this review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error deleting review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Find the review by ID
    const review = await Review.findById(req.params.id);

    // Check if the review exists
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the review belongs to the logged-in user
    if (review.user_id.toString() !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    // Delete the review
    await Review.findByIdAndDelete(req.params.id);

    // Return a success message
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

export default router;
