import axios from "axios";

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: process.env.dbUser,
  host: process.env.dbHost,
  database: process.env.dbName,
  password: process.env.dbPassword,
  port: process.env.dbPort,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, password } = req.body;

      const hashPass = await bcrypt
        .genSalt(10)
        .then((salt) => {
          console.log("Salt: ", salt);
          return bcrypt.hash(password, salt);
        })
        .then((hash) => {
          return hash;
        })
        .catch((err) => {
          console.error(err.message);
          throw err;
        });

      const client = await pool.connect();

      try {
        const result = await client.query(
          "INSERT INTO user_table(username, password) VALUES($1, $2)",
          [username, hashPass]
        );
        res.status(200).json({ success: true, message: "Success" });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error executing query:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
