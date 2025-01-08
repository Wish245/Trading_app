# cmake_minimum_required(VERSION 3.10)
# project(FlowerMarketBackend)

# # Use C++17
# set(CMAKE_CXX_STANDARD 17)
# set(CMAKE_CXX_STANDARD_REQUIRED True)

# # Include directories
# include_directories(include)
# include_directories("C:/Program Files/MySQL/MySQL Connector C++ 9.1/include")

# # Link directories
# link_directories("C:/Program Files/MySQL/MySQL Connector C++ 9.1/lib64")

# # Add source files
# file(GLOB SOURCES "src/*.cpp" "src/routes/*.cpp")

# # Create executable
# add_executable(${PROJECT_NAME} ${SOURCES})

# # Link libraries
# target_link_libraries(${PROJECT_NAME} mysqlcppconn)

# # Add Crow library (if you're using Crow as a header-only library)
# # Assuming Crow is in a subdirectory called "crow"
# include_directories(${CMAKE_SOURCE_DIR}/crow)

# # Add MySQL Connector/C++ library
# find_package(MySQL REQUIRED)
# if (MySQL_FOUND)
#     include_directories(${MySQL_INCLUDE_DIRS})
#     target_link_libraries(${PROJECT_NAME} ${MySQL_LIBRARIES})
# else()
#     message(FATAL_ERROR "MySQL Connector/C++ not found!")
# endif()

# # Add threading support (required for Crow and MySQL Connector/C++)
# find_package(Threads REQUIRED)
# target_link_libraries(${PROJECT_NAME} Threads::Threads)

# # Add OpenSSL (required for MySQL Connector/C++)
# find_package(OpenSSL REQUIRED)
# target_link_libraries(${PROJECT_NAME} OpenSSL::SSL OpenSSL::Crypto)

# # Add Boost (required for Crow)
# find_package(Boost REQUIRED COMPONENTS system)
# target_link_libraries(${PROJECT_NAME} Boost::system)

# # Add ZLIB (required for Crow)
# find_package(ZLIB REQUIRED)
# target_link_libraries(${PROJECT_NAME} ZLIB::ZLIB)

cmake_minimum_required(VERSION 3.10)
project(FlowerMarketBackend)

# Use C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
cmake_policy(SET CMP0167 OLD)


# Add custom FindMySQL.cmake path
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_BINARY_DIR}/CMakeFiles")

# Include directories
include_directories(include)
include_directories("C:/Program Files/MySQL/MySQL Connector C++ 9.1/include")

# Link directories
link_directories("C:/Program Files/MySQL/MySQL Connector C++ 9.1/lib64")

# Add source files
file(GLOB SOURCES "src/*.cpp" "src/routes/*.cpp")

# Create executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Link MySQL library manually (no find_package required for MySQL)
include_directories("C:/Program Files/MySQL/MySQL Connector C++ 9.1/include")
target_link_libraries(${PROJECT_NAME} "C:/Program Files/MySQL/MySQL Connector C++ 9.1/lib64/mysqlcppconn.lib")

# Add Crow library (if you're using Crow as a header-only library)
# Assuming Crow is in a subdirectory called "crow"
include_directories(${CMAKE_SOURCE_DIR}/crow)

# Add threading support (required for Crow and MySQL Connector/C++)
find_package(Threads REQUIRED)
target_link_libraries(${PROJECT_NAME} Threads::Threads)

# Add OpenSSL (required for MySQL Connector/C++)
# Add OpenSSL (required for MySQL Connector/C++)
set(OPENSSL_ROOT_DIR "C:/Program Files/OpenSSL-Win64")
set(OPENSSL_INCLUDE_DIR "C:/Program Files/OpenSSL-Win64/include")
set(OPENSSL_CRYPTO_LIBRARY "C:/Program Files/OpenSSL-Win64/lib/VC/x64/MD/libcrypto.lib")
set(OPENSSL_SSL_LIBRARY "C:/Program Files/OpenSSL-Win64/lib/VC/x64/MD/libssl.lib")

find_package(OpenSSL REQUIRED)
if (OpenSSL_FOUND)
    include_directories(${OPENSSL_INCLUDE_DIR})
    target_link_libraries(${PROJECT_NAME} ${OPENSSL_SSL_LIBRARY} ${OPENSSL_CRYPTO_LIBRARY})
else()
    message(FATAL_ERROR "OpenSSL not found!")
endif()


# Add Boost (required for Crow)
# Add Boost (required for Crow)
set(BOOST_ROOT "C:/Boost")
set(BOOST_INCLUDEDIR "C:/Boost/include")
set(BOOST_LIBRARYDIR "C:/Boost/lib")

find_package(Boost REQUIRED COMPONENTS system)
if (Boost_FOUND)
    include_directories(${Boost_INCLUDE_DIRS})
    target_link_libraries(${PROJECT_NAME} Boost::system)
else()
    message(FATAL_ERROR "Boost not found!")
endif()

# Add ZLIB (required for Crow)
find_package(ZLIB REQUIRED)
target_link_libraries(${PROJECT_NAME} ZLIB::ZLIB)
