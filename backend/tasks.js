const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./database");

const router = express.Router();

const JWT_SECRET = "task_management_secret_2026";

// ===============================
// AUTH MIDDLEWARE
// ===============================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access denied. Token required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};

// ===============================
// GET ALL TASKS
// GET /api/tasks
// ===============================
router.get("/", authenticateToken, (req, res) => {
  const sql = `
    SELECT id, user_id, title, description, status, created_at, updated_at
    FROM tasks
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: "Failed to fetch tasks",
      });
    }

    res.json(results);
  });
});

// ===============================
// CREATE TASK
// POST /api/tasks
// ===============================
router.post("/", authenticateToken, (req, res) => {
  const { title, description, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: "Task title is required",
    });
  }

  const taskStatus = status || "To Do";

  const sql = `
    INSERT INTO tasks
    (user_id, title, description, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      req.user.id,
      title.trim(),
      description || "",
      taskStatus,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Failed to create task",
        });
      }

      res.status(201).json({
        message: "Task created successfully",
        task: {
          id: result.insertId,
          user_id: req.user.id,
          title: title.trim(),
          description: description || "",
          status: taskStatus,
        },
      });
    }
  );
});

// ===============================
// UPDATE TASK
// PUT /api/tasks/:id
// ===============================
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: "Task title is required",
    });
  }

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [
      title.trim(),
      description || "",
      status || "To Do",
      id,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Failed to update task",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Task not found",
        });
      }

      res.json({
        message: "Task updated successfully",
      });
    }
  );
});

// ===============================
// DELETE TASK
// DELETE /api/tasks/:id
// ===============================
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [id, req.user.id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          error: "Failed to delete task",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Task not found",
        });
      }

      res.json({
        message: "Task deleted successfully",
      });
    }
  );
});

module.exports = router;