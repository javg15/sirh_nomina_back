const { authJwt } = require("../middleware");
const controller = require("../controllers/reducciones.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/reducciones/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/reducciones/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/reducciones/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/reducciones/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};