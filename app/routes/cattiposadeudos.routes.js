const { authJwt } = require("../middleware");
const controller = require("../controllers/cattiposadeudos.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/cattiposadeudos/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
   

    app.post(
        "/api/cattiposadeudos/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/cattiposadeudos/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    

    app.post(
        "/api/cattiposadeudos/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    
};