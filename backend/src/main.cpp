#include <crow.h>
// #include "routes/database_route.h"
// #include "routes/home_route.h"
#include "routes/stock_router.h"
#include "routes/auth_router.h"
#include "routes/profile_router.h"
#include "routes/order_router.h"

int main() {
    crow::SimpleApp app;

    initAuthRoutes(app);
    initProfileRoutes(app);
    initStockRoutes(app);
    initOrderRoutes(app);
    
    app.port(8080).multithreaded().run();
    return 0;
}