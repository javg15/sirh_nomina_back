const { authJwt } = require("../middleware");
const controller = require("../controllers/catfondospresupuestales.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catfondospresupuestales/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
   

    app.post(
        "/api/catfondospresupuestales/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catfondospresupuestales/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    

    app.post(
        "/api/catfondospresupuestales/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    
};