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
      const { category_name, description, url } = req.body;

      const client = await pool.connect();

      // const url = "/" + category_name.toLowerCase().replace(" ", "-");
      // console.log(url);

      try {
        const result = await client.query(
          "INSERT INTO category_table(category_name, description, url) VALUES($1, $2, $3)",
          [category_name, description, url]
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
