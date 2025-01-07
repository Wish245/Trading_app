#ifndef AUTH_ROUTER_H
#define AUTH_ROUTER_H

#include <crow.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>
#include <cppconn/exception.h>
#include <memory>
#include <string>
#include <iostream>

// Function declarations
std::shared_ptr<sql::Connection> connectToDatabase();
void loginHandler(const crow::request& req, crow::response& res);
void signupHandler(const crow::request& req, crow::response& res);
void logoutHandler(const crow::request& req, crow::response& res);
void initAuthRoutes(crow::SimpleApp& app);

#endif // AUTH_ROUTER_H