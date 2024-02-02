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
      const { user_id, username } = req.body;

      const client = await pool.connect();

      try {
        const result = await client.query(
          "UPDATE user_table SET username = $1 WHERE user_id = $2",
          [username, user_id]
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
