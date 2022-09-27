const { authJwt } = require("../middleware");
const controller = require("../controllers/catrecibostipos.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catrecibostipos/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
   

    app.post(
        "/api/catrecibostipos/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catrecibostipos/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    

    app.post(
        "/api/catrecibostipos/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    
};