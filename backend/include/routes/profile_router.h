#ifndef PROFILE_ROUTER_H
#define PROFILE_ROUTER_H

#include <crow.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>
#include <memory>
#include <iostream>
#include <string>

// Function to connect to the database
std::shared_ptr<sql::Connection> connectToDatabase();

// Fetch user profile data
void fetchProfileHandler(const crow::request& req, crow::response& res);

// Update user profile
void updateProfileHandler(const crow::request& req, crow::response& res);

// Fetch dashboard data
void fetchDashboardDataHandler(const crow::request& req, crow::response& res);

// Fetch stock data
void fetchStockDataHandler(const crow::request& req, crow::response& res);

// Fetch order history
void fetchOrderHistoryHandler(const crow::request& req, crow::response& res);

// Fetch monthly earnings
void fetchMonthlyEarningsHandler(const crow::request& req, crow::response& res);

// Fetch notifications
void fetchNotificationsHandler(const crow::request& req, crow::response& res);

// Dismiss notification
void dismissNotificationHandler(const crow::request& req, crow::response& res);

// Initialize profile and dashboard routes
void initProfileRoutes(crow::SimpleApp& app);

#endif // PROFILE_ROUTER_H