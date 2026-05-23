const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/register", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO members(username,email,password) VALUES($1,$2,$3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err.message);
  }

});

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});