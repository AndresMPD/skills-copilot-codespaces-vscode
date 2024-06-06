// Create web server
// Create a new comment
// Get all comments
// Get a comment by id
// Update a comment
// Delete a comment

const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// Create a new comment
router.post("/", async (req, res) => {
  const comment = new Comment({
    text: req.body.text,
    postId: req.body.postId
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a comment by id
router.get("/:id", getComment, (req, res) => {
  res.json(res.comment);
});

// Update a comment
router.patch("/:id", getComment, async (req, res) => {
  if (req.body.text !== null) {
    res.comment.text = req.body.text;
  }

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a comment
router.delete("/:id", getComment, async (req, res) => {
  try {
    await res.comment.remove();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getComment(req, res, next) {
  let comment;

  try {
    comment = await Comment.findById(req.params.id);

    if (comment === null) {
      return res.status(404).json({ message: "Cannot find comment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comment = comment;
  next();
}

module.exports = router;