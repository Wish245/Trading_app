cmake_minimum_required(VERSION 3.10)
project(FlowerMarketBackend)

# Use C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Include directories
include_directories(include)
include_directories("C:/Program Files/MySQL/MySQL Connector C++ 9.1/include")

# Link directories
link_directories("C:/Program Files/MySQL/MySQL Connector C++ 9.1/lib64")

# Add source files
file(GLOB SOURCES "src/*.cpp" "src/routes/*.cpp")

# Create executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Link libraries
target_link_libraries(${PROJECT_NAME} mysqlcppconn)

# Add Crow library (if you're using Crow as a header-only library)
# Assuming Crow is in a subdirectory called "crow"
include_directories(${CMAKE_SOURCE_DIR}/crow)

# Add MySQL Connector/C++ library
find_package(MySQL REQUIRED)
if (MySQL_FOUND)
    include_directories(${MySQL_INCLUDE_DIRS})
    target_link_libraries(${PROJECT_NAME} ${MySQL_LIBRARIES})
else()
    message(FATAL_ERROR "MySQL Connector/C++ not found!")
endif()

# Add threading support (required for Crow and MySQL Connector/C++)
find_package(Threads REQUIRED)
target_link_libraries(${PROJECT_NAME} Threads::Threads)

# Add OpenSSL (required for MySQL Connector/C++)
find_package(OpenSSL REQUIRED)
target_link_libraries(${PROJECT_NAME} OpenSSL::SSL OpenSSL::Crypto)

# Add Boost (required for Crow)
find_package(Boost REQUIRED COMPONENTS system)
target_link_libraries(${PROJECT_NAME} Boost::system)

# Add ZLIB (required for Crow)
find_package(ZLIB REQUIRED)
target_link_libraries(${PROJECT_NAME} ZLIB::ZLIB)