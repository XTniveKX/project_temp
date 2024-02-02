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
      const { item_id } = req.body;

      const client = await pool.connect();

      try {
        const result = await client.query(
          "DELETE FROM item_table WHERE item_id = $1",
          [item_id]
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
