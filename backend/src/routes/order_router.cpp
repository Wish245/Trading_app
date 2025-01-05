#include "order_router.h"
#include <iostream>

// Connect to the database
std::shared_ptr<sql::Connection> connectToDatabase() {
    sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
    return std::shared_ptr<sql::Connection>(
        driver->connect("tcp://127.0.0.1:3306", "root", "") // Update DB credentials
    );
}

// Handle order submission
void orderHandler(const crow::request& req, crow::response& res) {
    // Parse JSON body
    auto body = crow::json::load(req.body);
    if (!body || !body.has("flowerId") || !body.has("quantity") || !body.has("total") || !body.has("user_id")) {
        res.code = 400;
        res.write("{\"status\":\"error\",\"message\":\"Invalid request payload\"}");
        res.end();
        return;
    }

    int flowerId = body["flowerId"].i();
    int quantity = body["quantity"].i();
    double total = body["total"].d();
    std::string userId = body["user_id"].s();

    if (quantity <= 0 || total <= 0.0) {
        res.code = 400;
        res.write("{\"status\":\"error\",\"message\":\"Quantity and total must be positive\"}");
        res.end();
        return;
    }

    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market"); // Replace with your database name

        // Insert order into the database
        std::unique_ptr<sql::PreparedStatement> pstmt(
            conn->prepareStatement("INSERT INTO orders (flower_id, quantity, total, user_id) VALUES (?, ?, ?, ?)")
        );
        pstmt->setInt(1, flowerId);
        pstmt->setInt(2, quantity);
        pstmt->setDouble(3, total);
        pstmt->setString(4, userId);
        pstmt->executeUpdate();

        res.code = 201;
        res.write("{\"status\":\"success\",\"message\":\"Order placed successfully\"}");
    } catch (const sql::SQLException& e) {
        std::cerr << "SQL Error: " << e.what() << std::endl;
        res.code = 500;
        res.write("{\"status\":\"error\",\"message\":\"Database error\"}");
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        res.code = 500;
        res.write("{\"status\":\"error\",\"message\":\"Internal server error\"}");
    }

    res.end();
}

// Initialize order routes
void initOrderRoutes(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/order").methods("POST"_method)(orderHandler);
}
