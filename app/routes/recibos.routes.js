const { authJwt } = require("../middleware");
const controller = require("../controllers/recibos.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/recibos/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/recibos/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/recibos/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/recibos/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};