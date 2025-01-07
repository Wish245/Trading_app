#ifndef STOCK_ROUTER_H
#define STOCK_ROUTER_H

#include <crow.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>
#include <cppconn/exception.h>
#include <memory>
#include <string>
#include <vector>
#include <stdexcept>
#include <algorithm>
#include <cctype>

// Function declarations
std::shared_ptr<sql::Connection> connectToDatabase();
std::string sanitizeFileName(const std::string& fileName);
std::string base64Decode(const std::string& base64Content);
void ensureUploadDirectoryExists(const std::string& directory);
std::string saveImage(const std::string& base64Content, const std::string& fileName);
void stockHandler(const crow::request& req, crow::response& res);
void newArrivalsHandler(const crow::request& req, crow::response& res);
void initStockRoutes(crow::SimpleApp& app);

#endif // STOCK_ROUTER_H