import dotenv from "dotenv";

try {
    dotenv.config();
} catch (ex) {}

let dbName = "";
if (process.env.NODE_ENV == "test") {
    dbName = process.env.TEST_DATABASE;
} else {
    dbName = process.env.DATABASE_NAME;
}

export const config = {
    db: {
        host: "127.0.0.1", // localhost
        user: "dbuser",
        password: process.env.MYSQL_PASSWORD,
        database: dbName
    }
};
