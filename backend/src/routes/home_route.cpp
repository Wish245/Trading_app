#include "routes/home_route.h"

void setupHomeRoute(crow::SimpleApp& app) {
    CROW_ROUTE(app, "/")([]() {
        return "Welcome to the Flower Market Backend!";
    });
}
