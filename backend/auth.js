const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");

const router = express.Router();

const JWT_SECRET = "task_management_secret_2026";

// =============================
// REGISTER
// =============================
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (username, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [username.trim(), email.trim(), hashedPassword],
      (err, result) => {
        if (err) {
          console.error("❌ REGISTER DATABASE ERROR:", err);
          console.error("SQL MESSAGE:", err.message);

          return res.status(500).json({
            error: err.message || "Database error",
          });
        }

        return res.status(201).json({
          message: "Registered successfully",
        });
      }
    );
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
});


// =============================
// LOGIN
// =============================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const sql = `
    SELECT id, username, email, password
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  db.query(sql, [email.trim()], async (err, results) => {
    if (err) {
      console.error("❌ LOGIN DATABASE ERROR:", err);
      console.error("SQL MESSAGE:", err.message);

      return res.status(500).json({
        error: err.message || "Database error",
      });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("❌ PASSWORD CHECK ERROR:", error);

      return res.status(500).json({
        error: error.message || "Login error",
      });
    }
  });
});

module.exports = router;