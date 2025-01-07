#ifndef ORDER_ROUTER_H
#define ORDER_ROUTER_H

#include <crow.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/exception.h>
#include <memory>
#include <string>
#include <stdexcept>
#include <iostream>

// Function declarations
std::shared_ptr<sql::Connection> connectToDatabase();
void orderHandler(const crow::request& req, crow::response& res);
void initOrderRoutes(crow::SimpleApp& app);

#endif // ORDER_ROUTER_H