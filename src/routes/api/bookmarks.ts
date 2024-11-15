
import { Router, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import Bookmark from '../../models/bookmark.js';
import { authenticateToken } from "../../middlewares/authentication.js";

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string } | JwtPayload;
}
/**
 * @swagger
 * /api/bookmarks/:book_id/add:
 *   post:
 *     summary: Add a new bookmark to a specific book
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: book_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page_number:
 *                 type: integer
 *                 description: The page number to bookmark
 *               note:
 *                 type: string
 *                 description: A note for the bookmark
 *     responses:
 *       201:
 *         description: Bookmark added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bookmark:
 *                   type: object
 *       400:
 *         description: Bad request, bookmark already exists
 *       500:
 *         description: Error adding bookmark
 */
router.post('/:book_id/add', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { page_number, note } = req.body;
    const { book_id } = req.params;

    // Check if the user already has a bookmark for this page in the same book
    const existingBookmark = await Bookmark.findOne({
      user_id: req.user?.id,
      book_id,
      page_number,
    });

    if (existingBookmark) {
      return res.status(400).json({
        message: 'You have already bookmarked this page in this book',
      });
    }

    // Create a new bookmark instance
    const newBookmark = new Bookmark({
      user_id: req.user?.id, // Retrieve user ID from authenticated user
      book_id,
      page_number,
      note,
    });

    // Save the bookmark to the database
    const savedBookmark = await newBookmark.save();

    // Return the saved bookmark as the response
    res.status(201).json({
      message: 'Bookmark added successfully',
      bookmark: savedBookmark,
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Error adding bookmark' });
  }
});

/**
 * @swagger
 * /api/bookmarks/:id:
 *   put:
 *     summary: Update an existing bookmark
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the bookmark to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 description: The updated note for the bookmark
 *     responses:
 *       200:
 *         description: Bookmark updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bookmark:
 *                   type: object
 *       404:
 *         description: Bookmark not found or unauthorized
 *       500:
 *         description: Error updating bookmark
 */
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { note } = req.body;

    // Find the bookmark by ID and ensure it belongs to the logged-in user
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found!' });
    }

    // Check if the bookmark belongs to the logged-in user
    if (bookmark.user_id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to update this bookmark' });
    }

    // Update fields if provided in the request
    if (note !== undefined) bookmark.note = note; // Allow note to be empty or null

    // Update the `updated_at` timestamp
    bookmark.updated_at = new Date(Date.now());

    // Save the updated bookmark
    const updatedBookmark = await bookmark.save();

    // Return the updated bookmark as the response
    res.json({
      message: 'Bookmark updated successfully',
      bookmark: updatedBookmark,
    });
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ message: 'Error updating bookmark' });
  }
});

/**
 * @swagger
 * /api/bookmarks/:id:
 *   delete:
 *     summary: Delete a bookmark
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the bookmark to delete
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Bookmark not found or unauthorized
 *       500:
 *         description: Error deleting bookmark
 */
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Find the bookmark by ID and ensure it belongs to the logged-in user
    const bookmark = await Bookmark.findById(req.params.id);

    // Check if the bookmark exists
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found or unauthorized' });
    }

    // Check if the bookmark belongs to the logged-in user
    if (bookmark.user_id.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this bookmark' });
    }

    // Delete the bookmark
    await Bookmark.findByIdAndDelete(req.params.id);

    // Return a success message
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: 'Error deleting bookmark' });
  }
});

export default router;
