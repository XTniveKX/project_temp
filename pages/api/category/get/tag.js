const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.dbUser,
  host: process.env.dbHost,
  database: process.env.dbName,
  password: process.env.dbPassword,
  port: process.env.dbPort,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("ASDSAODKSAODKASDK")
    try {
      const { tag } = req.query;
      const client = await pool.connect();

      try {
        const result = await client.query(
          "SELECT * FROM category_table WHERE tag = $1",
          [tag]
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
