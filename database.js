const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const databaseFolder = path.join(__dirname, "database");

// Create database folder if it doesn't exist
if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, { recursive: true });
}

const databasePath = path.join(
    databaseFolder,
    "revenue-resilience-dashboard.db"
);

const db = new sqlite3.Database(databasePath, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to SQLite database");
    }
});

const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });

const get = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });

const all = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

module.exports = {
    db,
    run,
    get,
    all
};