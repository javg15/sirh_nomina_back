const { authJwt } = require("../middleware");
const controller = require("../controllers/personal.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/personal/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/personal/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    app.post(
        "/api/personal/getRecordSegunUsuario", [authJwt.verifyToken],
        controller.getRecordSegunUsuario
    );
    app.post(
        "/api/personal/getRecordAntiguedad", [authJwt.verifyToken],
        controller.getRecordAntiguedad
    );
    app.post(
        "/api/personal/getAntiguedadEnQuincenas", [authJwt.verifyToken],
        controller.getAntiguedadEnQuincenas
    );



    app.post(
        "/api/personal/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/personal/setRecord2", [authJwt.verifyToken],
        controller.setRecord2
    );

    app.post(
        "/api/personal/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );

    app.post(
        "/api/personal/getRecordSegunCURP", [authJwt.verifyToken],
        controller.getRecordSegunCURP
    );

    app.post(
        "/api/personal/getCatalogoSegunBusqueda", [authJwt.verifyToken],
        controller.getCatalogoSegunBusqueda
    );

};