const { authJwt } = require("../middleware");
const controller = require("../controllers/percepcionesadeudos.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/percepcionesadeudos/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/percepcionesadeudos/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/percepcionesadeudos/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/percepcionesadeudos/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};