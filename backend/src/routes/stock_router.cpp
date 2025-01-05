#include "stock_router.h"
#include <iostream>
#include <fstream>
#include <crow/json.h>
#include <string>
#include <vector>
#include <memory>
#include <sys/stat.h>
#include <sys/types.h>
#include <stdexcept>
#include <algorithm>
#include <cctype>

// Function to connect to the database
std::shared_ptr<sql::Connection> connectToDatabase() {
    sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
    return std::shared_ptr<sql::Connection>(
        driver->connect("tcp://127.0.0.1:3306", "root", "") // Update your DB credentials
    );
}
std::string sanitizeFileName(const std::string& fileName) {
    std::string sanitized = fileName;
    std::replace_if(sanitized.begin(), sanitized.end(), [](char c) {
        return !std::isalnum(c) && c != '.' && c != '_';
    }, '_');

    // Remove any potential path traversal attempts
    sanitized.erase(std::remove(sanitized.begin(), sanitized.end(), '/'), sanitized.end());
    sanitized.erase(std::remove(sanitized.begin(), sanitized.end(), '\\'), sanitized.end());

    return sanitized;
}


std::string base64Decode(const std::string& base64Content) {
    static const std::string base64Chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    auto isBase64 = [](unsigned char c) {
        return std::isalnum(c) || (c == '+') || (c == '/');
    };

    if (base64Content.empty()) {
        return "";
    }

    std::string decodedData;
    std::vector<int> decodingTable(256, -1);

    for (int i = 0; i < 64; ++i) {
        decodingTable[base64Chars[i]] = i;
    }

    int val = 0, valb = -8;
    for (unsigned char c : base64Content) {
        if (!isBase64(c)) {
            throw std::invalid_argument("Invalid Base64 character encountered");
        }

        val = (val << 6) + decodingTable[c];
        valb += 6;
        if (valb >= 0) {
            decodedData.push_back(static_cast<char>((val >> valb) & 0xFF));
            valb -= 8;
        }
    }

    return decodedData;
}

void ensureUploadDirectoryExists(const std::string& directory) {
    struct stat info;

    if (stat(directory.c_str(), &info) != 0) {
        // Directory does not exist, create it
        if (mkdir(directory.c_str(), 0777) != 0) {
            throw std::runtime_error("Failed to create upload directory: " + directory);
        }
    } else if (!(info.st_mode & S_IFDIR)) {
        throw std::runtime_error("Upload path exists but is not a directory: " + directory);
    }
}

// Save image to disk
std::string saveImage(const std::string& base64Content, const std::string& fileName) {
    std::string directory = "./uploads/";
    ensureUploadDirectoryExists(directory);

    std::string filePath = directory + sanitizeFileName(fileName);
    std::ofstream file(filePath, std::ios::binary);
    if (file) {
        std::string decodedContent = base64Decode(base64Content);
        file.write(decodedContent.c_str(), decodedContent.size());
        file.close();
        return filePath;
    }
    throw std::runtime_error("Failed to save the file.");
}

// Stock route handler
void stockHandler(const crow::request& req, crow::response& res) {
    // Parse JSON body
    auto body = crow::json::load(req.body);

    std::string user_id = body["user_id"].s();
    std::string flowerName = body["flowerName"].s();
    int quantity = body["quantity"].i();
    double price = body["price"].d();
    std::string image = body["image"].s(); // Assume base64-encoded string

    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market"); // Replace with your database name

        // Save image
        std::string filePath = saveImage(image, flowerName + ".jpg");

        // Insert data into database
        std::unique_ptr<sql::PreparedStatement> pstmt(
            conn->prepareStatement("INSERT INTO flower_stock (flower_name, quantity, price, image_path, user_id) VALUES (?, ?, ?, ?, ?)")
        );
        pstmt->setString(1, flowerName);
        pstmt->setInt(2, quantity);
        pstmt->setDouble(3, price);
        pstmt->setString(4, filePath);
        pstmt->setString(5, user_id);
        pstmt->executeUpdate();

        res.code = 201;
        res.write("{\"status\":\"success\",\"message\":\"Flower stock added successfully\"}");
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

// New Arrivals route handler
void newArrivalsHandler(const crow::request& req, crow::response& res) {
    try {
        auto conn = connectToDatabase();
        conn->setSchema("flower_market");

        std::unique_ptr<sql::PreparedStatement> pstmt(
            conn->prepareStatement("SELECT id, flower_name, price, image_path FROM flower_stock WHERE is_new = 1")
        );
        std::unique_ptr<sql::ResultSet> resultSet(pstmt->executeQuery());

        crow::json::wvalue response;
        response["newArrivals"] = crow::json::wvalue::list();

        while (resultSet->next()) {
            crow::json::wvalue flower;
            flower["id"] = resultSet->getInt("id");
            flower["name"] = resultSet->getString("flower_name");
            flower["price"] = resultSet->getDouble("price");
            flower["image"] = resultSet->getString("image_path");

            response["newArrivals"].push_back(flower);
        }

        res.code = 200;
        res.write(crow::json::dump(response));
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        res.code = 500;
        res.write("{\"status\":\"error\",\"message\":\"Internal server error\"}");
    }

    res.end();
}

// Initialize stock routes
void initStockRoutes(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/api/stock").methods("POST"_method)(stockHandler);
    CROW_ROUTE(app, "/api/new-arrivals").methods("GET"_method)(newArrivalsHandler);
}
