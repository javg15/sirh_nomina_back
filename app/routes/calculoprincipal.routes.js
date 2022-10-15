const { authJwt } = require("../middleware");
const controller = require("../controllers/calculoprincipal.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/calculoprincipal/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/calculoprincipal/getCalculado", [authJwt.verifyToken],
        controller.getCalculado
    );
    app.post(
        "/api/calculoprincipal/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    app.post(
        "/api/calculoprincipal/ejecutarCalculo", [authJwt.verifyToken],
        controller.ejecutarCalculo
    );
    
};