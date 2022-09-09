const { authJwt } = require("../middleware");
const controller = require("../controllers/categoriasasignacion.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/categoriasasignacion/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/categoriasasignacion/getAdminSub", [authJwt.verifyToken],
        controller.getAdminSub
    );
    app.post(
        "/api/categoriasasignacion/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    app.post(
        "/api/user/getRecordPercepciones", [authJwt.verifyToken],
        controller.getRecordPercepciones
    );
    app.post(
        "/api/user/getRecordDeducciones", [authJwt.verifyToken],
        controller.getRecordDeducciones
    );
    app.post(
        "/api/categoriasasignacion/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/categoriasasignacion/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );

    /**desde la modalidad de percepciones/deducciones */
    app.post(
        "/api/categoriasasignacion/getAdminPerc", [authJwt.verifyToken],
        controller.getAdminPerc
    );
    app.post(
        "/api/categoriasasignacion/getAdminSubPerc", [authJwt.verifyToken],
        controller.getAdminSubPerc
    );
    app.post(
        "/api/categoriasasignacion/getRecordPerc", [authJwt.verifyToken],
        controller.getRecordPerc
    );
    app.post(
        "/api/user/getRecordCategorias", [authJwt.verifyToken],
        controller.getRecordCategorias
    );
    app.post(
        "/api/categoriasasignacion/setRecordPerc", [authJwt.verifyToken],
        controller.setRecord
    );
    
};