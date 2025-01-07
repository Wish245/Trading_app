#ifndef PROFILE_ROUTER_H
#define PROFILE_ROUTER_H

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
void fetchProfileHandler(const crow::request& req, crow::response& res);
void updateProfileHandler(const crow::request& req, crow::response& res);
void fetchDashboardDataHandler(const crow::request& req, crow::response& res);
void initProfileRoutes(crow::SimpleApp& app);

#endif // PROFILE_ROUTER_H