#include "auth_router.h"
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>
#include <iostream>
#include <string>

// Function to connect to the database
std::shared_ptr<sql::Connection> connectToDatabase() {
    sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
    return std::shared_ptr<sql::Connection>(driver->connect("tcp://127.0.0.1:3306", "root", "")); // Update credentials
}

// Login route handler
void loginHandler(const crow::request& req, crow::response& res) {
    auto body = crow::json::load(req.body);
    if (!body || !body.has("username") || !body.has("password")) {
        res.code = 400;
        res.write("{\"status\":\"error\",\"message\":\"Invalid request payload\"}");
        res.end();
        return;
    }

    std::string username = body["username"].s();
    std::string password = body["password"].s();

    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market"); // Replace with your database name

        // Fetch both password and userId from the database
        std::unique_ptr<sql::PreparedStatement> pstmt(
            conn->prepareStatement("SELECT id, password FROM users WHERE username = ?"));
        pstmt->setString(1, username);
        std::unique_ptr<sql::ResultSet> resSet(pstmt->executeQuery());

        if (resSet->next()) {
            std::string dbPassword = resSet->getString("password");
            if (dbPassword == password) {
                // Get the userId from the result set
                int userId = resSet->getInt("id");

                // Return userId in the response
                res.code = 200;
                res.write("{\"status\":\"success\",\"message\":\"Login successful\",\"userId\":" + std::to_string(userId) + "}");
            } else {
                res.code = 401;
                res.write("{\"status\":\"error\",\"message\":\"Invalid credentials\"}");
            }
        } else {
            res.code = 404;
            res.write("{\"status\":\"error\",\"message\":\"User not found\"}");
        }
    } catch (sql::SQLException& e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        res.code = 500;
        res.write("{\"status\":\"error\",\"message\":\"Database error\"}");
    }
    res.end();
}

// Signup route handler
void signupHandler(const crow::request& req, crow::response& res) {
    auto body = crow::json::load(req.body);
    if (!body || !body.has("username") || !body.has("email") || !body.has("phone") || 
        !body.has("nationalID") || !body.has("password")) {
        res.code = 400;
        res.write("{\"status\":\"error\",\"message\":\"Invalid request payload\"}");
        res.end();
        return;
    }

    std::string username = body["username"].s();
    std::string email = body["email"].s();
    std::string phone = body["phone"].s();
    std::string nationalID = body["nationalID"].s();
    std::string password = body["password"].s();

    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market"); // Replace with your database name

        // Check if the user already exists
        std::unique_ptr<sql::PreparedStatement> checkStmt(
            conn->prepareStatement("SELECT username FROM users WHERE username = ? OR email = ?"));
        checkStmt->setString(1, username);
        checkStmt->setString(2, email);
        std::unique_ptr<sql::ResultSet> resSet(checkStmt->executeQuery());

        if (resSet->next()) {
            res.code = 409;
            res.write("{\"status\":\"error\",\"message\":\"User already exists\"}");
        } else {
            // Insert the new user
            std::unique_ptr<sql::PreparedStatement> insertStmt(
                conn->prepareStatement("INSERT INTO users (username, email, phone, nationalID, password) VALUES (?, ?, ?, ?, ?)"));
            insertStmt->setString(1, username);
            insertStmt->setString(2, email);
            insertStmt->setString(3, phone);
            insertStmt->setString(4, nationalID);
            insertStmt->setString(5, password);
            insertStmt->executeUpdate();

            res.code = 201;
            res.write("{\"status\":\"success\",\"message\":\"Signup successful\"}");
        }
    } catch (sql::SQLException& e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        res.code = 500;
        res.write("{\"status\":\"error\",\"message\":\"Database error\"}");
    }
    res.end();
}

// Initialize the routes
void initAuthRoutes(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/login").methods("POST"_method)(loginHandler);
    CROW_ROUTE(app, "/api/signup").methods("POST"_method)(signupHandler);
}