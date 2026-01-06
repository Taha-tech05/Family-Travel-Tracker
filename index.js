import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "1028715",
  port: 5432,
});
db.connect();

// Middleware
app.use(cors()); // Enable CORS for React frontend
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;


async function checkVisited() {
  const result = await db.query(
    "SELECT country_code, COUNT(user_id) as visit_count FROM visited_countries GROUP BY country_code"
  );
  return result.rows;
}

async function checkUserVisited() {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries where user_id=$1", [currentUserId]);
    return result.rows.map(row => row.country_code);
  }
  catch (err) {
    console.log(err);
    return [];
  }
}

async function checkUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}
// API endpoint to get all data
app.get("/api/data", async (req, res) => {
  try {
    const userCountries = await checkUserVisited();
    const allVisits = await checkVisited();
    const users = await checkUsers();

    // Get total country count for % calculation
    const countriesResult = await db.query("SELECT COUNT(*) FROM countries");
    const totalWorldCountries = parseInt(countriesResult.rows[0].count);

    // Get all user visits for top traveler calculation
    const allUserVisitsResult = await db.query("SELECT * FROM visited_countries");
    const allUserVisits = allUserVisitsResult.rows;

    let tempColor = "teal"; // default color
    if (users.length > 0) {
      const currentUser = users.find(u => u.id === currentUserId);
      if (currentUser) tempColor = currentUser.color;
    }

    res.json({
      countries: userCountries,
      allVisits: allVisits, // Grouped by country code for heatmap
      allUserVisits: allUserVisits, // Raw list for stats calculation
      totalWorldCountries: totalWorldCountries,
      total: userCountries.length,
      users: users,
      color: tempColor,
      currentUserId: currentUserId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/api/add", async (req, res) => {
  const input = req.body.country;

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    if (data) {
      const countryCode = data.country_code;
      try {
        await db.query(
          "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
          [countryCode, currentUserId]
        );
        res.json({ success: true, message: "Country added successfully" });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: "Country already added or database error" });
      }
    } else {
      res.status(404).json({ success: false, error: "Country not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
app.post("/api/user", async (req, res) => {
  try {
    if (req.body.user != null) {
      currentUserId = parseInt(req.body.user);
      res.json({ success: true, currentUserId: currentUserId });
    } else {
      res.status(400).json({ success: false, error: "User ID required" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/api/new", async (req, res) => {
  try {
    const userName = req.body.name;
    const userColor = req.body.color;
    const response = await db.query(
      "INSERT INTO users (name,color) VALUES ($1,$2) RETURNING id",
      [userName, userColor]
    );
    currentUserId = response.rows[0].id;
    res.json({
      success: true,
      userId: currentUserId,
      message: "User created successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to create user" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
