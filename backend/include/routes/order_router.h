#ifndef ORDER_ROUTER_H
#define ORDER_ROUTER_H

#include "crow_all.h"
#include <memory>
#include <string>
#include <cppconn/driver.h>
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/exception.h>

// Function to connect to the database
std::shared_ptr<sql::Connection> connectToDatabase();

// Function to check authentication
// bool isAuthenticated(const crow::request& req);

// Route handler for order submission
void orderHandler(const crow::request& req, crow::response& res);

// Function to initialize the order routes
void initOrderRoutes(crow::SimpleApp& app);

#endif // ORDER_ROUTER_H
