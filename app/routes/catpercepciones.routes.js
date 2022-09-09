const { authJwt } = require("../middleware");
const controller = require("../controllers/catpercepciones.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catpercepciones/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catpercepciones/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/catpercepciones/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/catpercepciones/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};