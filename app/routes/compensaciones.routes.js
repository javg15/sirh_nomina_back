const { authJwt } = require("../middleware");
const controller = require("../controllers/compensaciones.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/compensaciones/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/compensaciones/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/compensaciones/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    
};