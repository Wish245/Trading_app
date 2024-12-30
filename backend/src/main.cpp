#include <crow.h>
#include "routes/database_route.h"
#include "routes/home_route.h"

int main() {
    crow::SimpleApp app;

    setupDatabaseRoute(app);
    setupHomeRoute(app);

    app.port(8080).multithreaded().run();
    return 0;
}