const { authJwt } = require("../middleware");
const controller = require("../controllers/catquincena.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catquincena/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
    app.post(
        "/api/catquincena/getCatalogoSegunAnio", [authJwt.verifyToken],
        controller.getCatalogoSegunAnio
    );
    app.post(
        "/api/catquincena/getCatalogoSegunSemestre", [authJwt.verifyToken],
        controller.getCatalogoSegunSemestre
    );

    app.post(
        "/api/catquincena/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catquincena/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    app.post(
        "/api/catquincena/getQuincenaActiva", [authJwt.verifyToken],
        controller.getQuincenaActiva
    );

    app.post(
        "/api/catquincena/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/catquincena/setUpdateFromWebService", [authJwt.verifyToken],
        controller.setUpdateFromWebService
    );
};