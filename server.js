const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "PILLARIT_SECRET_2026";

app.get("/", (req, res) => {
  res.send("Backend Running");
});


// REGISTER
app.post("/register", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    const userCheck = await pool.query(
      "SELECT * FROM members WHERE email=$1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO members(username,email,password) VALUES($1,$2,$3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.log(err.message);
  }

});


// LOGIN
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM members WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
      }
    });

  } catch (err) {
    console.log(err.message);
  }

});


app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});