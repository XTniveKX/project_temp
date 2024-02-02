const { Pool } = require("pg");

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
      const { category_id, category_name, tag, description } = req.body;

      const client = await pool.connect();

      try {
        const result = await client.query(
          "UPDATE category_table SET category_name = $1, description = $2, tag = $3 WHERE category_id = $4",
          [category_name, description, tag, category_id]
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
