#ifndef PROFILE_ROUTER_H
#define PROFILE_ROUTER_H

#include <crow.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>
#include <iostream>
#include <string>
#include <memory>

// Function to connect to the database
std::shared_ptr<sql::Connection> connectToDatabase() {
    sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
    return std::shared_ptr<sql::Connection>(driver->connect("tcp://127.0.0.1:3306", "root", "")); // Update credentials
}

// Fetch user profile data
void fetchProfileHandler(const crow::request& req, crow::response& res) {
    std::string userId = req.url_params.get("user_id");

    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market");

        std::unique_ptr<sql::PreparedStatement> pstmt(
            conn->prepareStatement("SELECT username, email, phone, nationalID, profile_picture_path FROM users WHERE id = ?")
        );
        pstmt->setString(1, userId);
        std::unique_ptr<sql::ResultSet> resSet(pstmt->executeQuery());

        if (resSet->next()) {
            crow::json::wvalue response;
            response["username"] = resSet->getString("username");
            response["email"] = resSet->getString("email");
            response["phone"] = resSet->getString("phone");
            response["nationalID"] = resSet->getString("nationalID");
            response["profile_picture_path"] = resSet->getString("profile_picture_path");

            res.code = 200;
            res.write(crow::json::dump(response));
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

// Update user profile
void updateProfileHandler(const crow::request& req, crow::response& res) {
    auto body = crow::json::load(req.body);
    if (!body || !body.has("user_id") || !body.has("username") || !body.has("email") || 
        !body.has("phone") || !body.has("nationalID")) {
        res.code = 400;
        res.write("{\"status\":\"error\",\"message\":\"Invalid request payload\"}");
        res.end();
        return;
    }

    std::string userId = body["user_id"].s();
    std::string username = body["username"].s();
    std::string email = body["email"].s();
    std::string phone = body["phone"].s();
    std::string nationalID = body["nationalID"].s();

    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market");

        std::unique_ptr<sql::PreparedStatement> pstmt(
            conn->prepareStatement("UPDATE users SET username = ?, email = ?, phone = ?, nationalID = ? WHERE id = ?")
        );
        pstmt->setString(1, username);
        pstmt->setString(2, email);
        pstmt->setString(3, phone);
        pstmt->setString(4, nationalID);
        pstmt->setString(5, userId);
        pstmt->executeUpdate();

        res.code = 200;
        res.write("{\"status\":\"success\",\"message\":\"Profile updated successfully\"}");
    } catch (sql::SQLException& e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        res.code = 500;
        res.write("{\"status\":\"error\",\"message\":\"Database error\"}");
    }
    res.end();
}

// Fetch dashboard data
void fetchDashboardDataHandler(const crow::request& req, crow::response& res) {
    std::string userId = req.url_params.get("user_id");

    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market");

        // Fetch total earnings
        std::unique_ptr<sql::PreparedStatement> earningsStmt(
            conn->prepareStatement("SELECT SUM(total) AS total_earnings FROM orders WHERE user_id = ?")
        );
        earningsStmt->setString(1, userId);
        std::unique_ptr<sql::ResultSet> earningsResSet(earningsStmt->executeQuery());

        double totalEarnings = 0.0;
        if (earningsResSet->next()) {
            totalEarnings = earningsResSet->getDouble("total_earnings");
        }

        // Fetch completed orders count
        std::unique_ptr<sql::PreparedStatement> ordersStmt(
            conn->prepareStatement("SELECT COUNT(*) AS completed_orders FROM orders WHERE user_id = ?")
        );
        ordersStmt->setString(1, userId);
        std::unique_ptr<sql::ResultSet> ordersResSet(ordersStmt->executeQuery());

        int completedOrders = 0;
        if (ordersResSet->next()) {
            completedOrders = ordersResSet->getInt("completed_orders");
        }

        // Fetch stock status
        std::unique_ptr<sql::PreparedStatement> stockStmt(
            conn->prepareStatement("SELECT COUNT(*) AS total_stock, SUM(CASE WHEN quantity > 0 THEN 1 ELSE 0 END) AS in_stock FROM flower_stock WHERE user_id = ?")
        );
        stockStmt->setString(1, userId);
        std::unique_ptr<sql::ResultSet> stockResSet(stockStmt->executeQuery());

        int totalStock = 0;
        int inStock = 0;
        if (stockResSet->next()) {
            totalStock = stockResSet->getInt("total_stock");
            inStock = stockResSet->getInt("in_stock");
        }

        // Prepare response
        crow::json::wvalue response;
        response["total_earnings"] = totalEarnings;
        response["completed_orders"] = completedOrders;
        response["total_stock"] = totalStock;
        response["in_stock"] = inStock;
        response["out_of_stock"] = totalStock - inStock;

        res.code = 200;
        res.write(crow::json::dump(response));
    } catch (sql::SQLException& e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        res.code = 500;
        res.write("{\"status\":\"error\",\"message\":\"Database error\"}");
    }
    res.end();
}

// Initialize profile and dashboard routes
void initProfileRoutes(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/profile").methods("GET"_method)(fetchProfileHandler);
    CROW_ROUTE(app, "/api/profile/update").methods("POST"_method)(updateProfileHandler);
    CROW_ROUTE(app, "/api/dashboard").methods("GET"_method)(fetchDashboardDataHandler);
}

#endif // PROFILE_ROUTER_H