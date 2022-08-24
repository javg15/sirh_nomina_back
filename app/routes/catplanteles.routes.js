const { authJwt } = require("../middleware");
const controller = require("../controllers/catplanteles.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catplanteles/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catplanteles/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/catplanteles/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );

    app.post(
        "/api/catplanteles/setRecord2", [authJwt.verifyToken],
        controller.setRecord2
    );

    app.post(
        "/api/catplanteles/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
    app.post(
        "/api/catplanteles/getCatalogoSegunPersonal", [authJwt.verifyToken],
        controller.getCatalogoSegunPersonal
    );
    app.post(
        "/api/catplanteles/getCatalogoSinAdmin", [authJwt.verifyToken],
        controller.getCatalogoSinAdmin
    );

    //json
    app.post(
        "/api/catplanteles/getCatalogoOpen",
        controller.getCatalogoOpen
    );

};