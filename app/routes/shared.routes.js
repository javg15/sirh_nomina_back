const { authJwt } = require("../middleware");
const controller = require("../controllers/shared.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/shared/getSearchcampos", [authJwt.verifyToken],
        controller.getSearchcampos
    );
    app.post(
        "/api/shared/getSearchoperadores", [authJwt.verifyToken],
        controller.getSearchoperadores
    );
    app.post(
        "/api/shared/getEsquemas", [authJwt.verifyToken],
        controller.getEsquemas
    );
    app.post(
        "/api/shared/getTablas", [authJwt.verifyToken],
        controller.getTablas
    );
    app.post(
        "/api/shared/getCampos", [authJwt.verifyToken],
        controller.getCampos
    );
    app.post(
        "/api/shared/getFunciones", [authJwt.verifyToken],
        controller.getFunciones
    );
    
};