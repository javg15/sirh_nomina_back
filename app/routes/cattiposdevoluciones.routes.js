const { authJwt } = require("../middleware");
const controller = require("../controllers/cattiposdevoluciones.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/cattiposdevoluciones/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
   

    app.post(
        "/api/cattiposdevoluciones/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/cattiposdevoluciones/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    

    app.post(
        "/api/cattiposdevoluciones/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    
};