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
