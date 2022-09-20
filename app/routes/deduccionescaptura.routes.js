const { authJwt } = require("../middleware");
const controller = require("../controllers/deduccionescaptura.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/deduccionescaptura/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/deduccionescaptura/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/deduccionescaptura/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/deduccionescaptura/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};