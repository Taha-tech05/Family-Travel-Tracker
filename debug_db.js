import pg from 'pg';

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "1028715",
    port: 5432,
});

async function runDebug() {
    try {
        await db.connect();
        console.log("Connected to DB");

        const currentUserId = 1;

        const visitedResult = await db.query("SELECT country_code FROM visited_countries where user_id=$1", [currentUserId]);
        console.log("User Visited countries count:", visitedResult.rows.length);

        const allVisitsResult = await db.query(
            "SELECT country_code, COUNT(user_id) as visit_count FROM visited_countries GROUP BY country_code"
        );
        console.log("All Visits count:", allVisitsResult.rows.length);

        const usersResult = await db.query("SELECT * FROM users");
        console.log("Users count:", usersResult.rows.length);
        console.log("Users:", JSON.stringify(usersResult.rows));

        const countriesResult = await db.query("SELECT COUNT(*) FROM countries");
        console.log("Total World Countries:", countriesResult.rows[0].count);

        const allUserVisitsResult = await db.query("SELECT * FROM visited_countries");
        console.log("All User Visits count:", allUserVisitsResult.rows.length);

        await db.end();
    } catch (err) {
        console.error("DEBUG ERROR:", err);
    }
}

runDebug();
