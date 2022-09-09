const { authJwt } = require("../middleware");
const controller = require("../controllers/catdeducciones.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catdeducciones/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catdeducciones/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/catdeducciones/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/catdeducciones/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};