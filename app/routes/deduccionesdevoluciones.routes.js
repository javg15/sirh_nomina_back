const { authJwt } = require("../middleware");
const controller = require("../controllers/deduccionesdevoluciones.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/deduccionesdevoluciones/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/deduccionesdevoluciones/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/deduccionesdevoluciones/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/deduccionesdevoluciones/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};