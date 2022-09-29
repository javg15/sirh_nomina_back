const { authJwt } = require("../middleware");
const controller = require("../controllers/retroactivos.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/retroactivos/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/retroactivos/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/retroactivos/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    
};