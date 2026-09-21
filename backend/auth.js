const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("./database");

const router = express.Router();

const JWT_SECRET = "task_management_secret_2026";

// Automatic Realistic Security Email Function
const sendSecurityEmail = async (userEmail, actionType) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tanviparmar78@gmail.com",
        pass: "xtcfeyeqvatocjax"
      }
    });

    const mailOptions = {
      from: `"TaskFlow Security" <tanviparmar78@gmail.com>`,
      to: userEmail,
      subject: `Security Alert: New ${actionType} detected on Task Management`,
      text: `Hello,

We wanted to let you know that a successful ${actionType.toLowerCase()} was just performed on your Task Management (TaskFlow) account.

Here are the session details:
- Action Type: ${actionType}
- Platform: Task Management Web Application
- Time: ${new Date().toLocaleString()}
- Status: Successful 

If you initiated this ${actionType.toLowerCase()}, you can safely ignore this security notification. 

⚠️ Important Security Notice: If you did NOT perform this ${actionType.toLowerCase()} or if you suspect unauthorized access to your Task Management account, please secure your profile immediately or contact our support team.

Best regards,
The TaskManagement Security Team
Powered by TaskFlow`
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Automatic ${actionType} email sent successfully to ${userEmail}`);
  } catch (emailError) {
    console.error("❌ FULL EMAIL ERROR DETAILS:", emailError);
  }
};

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
      async (err, result) => {
        if (err) {
          console.error("❌ REGISTER DATABASE ERROR:", err);
          return res.status(500).json({
            error: err.message || "Database error",
          });
        }

        // Automatic Registration Email Bhejenge
        await sendSecurityEmail(email.trim(), "Registration");

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
      const isMatch = await bcrypt.compare(password, user.password);

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

      // Automatic Login Email Bhejenge
      await sendSecurityEmail(user.email, "Login");

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
