#ifndef STOCK_ROUTER_H
#define STOCK_ROUTER_H

#include "crow.h"
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>
#include <memory>
#include <string>

// Function to initialize stock-related routes
void initStockRoutes(crow::SimpleApp& app);

// Utility function to connect to the database
std::shared_ptr<sql::Connection> connectToDatabase();

// Route handlers
void stockHandler(const crow::request& req, crow::response& res);
void newArrivalsHandler(const crow::request& req, crow::response& res);

// Utility functions for file operations
std::string sanitizeFileName(const std::string& fileName);
std::string base64Decode(const std::string& base64Content);
void ensureUploadDirectoryExists(const std::string& directory);
std::string saveImage(const std::string& base64Content, const std::string& fileName);

#endif // STOCK_ROUTER_H
