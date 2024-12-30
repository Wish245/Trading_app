#include "routes/database_route.h"
#include <mysql/jdbc.h>

void setupDatabaseRoute(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/db-test")([]() {
        try {
            sql::Driver* driver = sql::mysql::get_driver_instance();
            std::unique_ptr<sql::Connection> conn(
                driver->connect("tcp://127.0.0.1:3306", "root", ""));
            conn->setSchema("your_database_name");

            return "Connected to the database successfully!";
        } catch (sql::SQLException& e) {
            return std::string("Database connection failed: ") + e.what();
        }
    });
}
