const { authJwt } = require("../middleware");
const controller = require("../controllers/catrecibosestatus.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catrecibosestatus/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
   

    app.post(
        "/api/catrecibosestatus/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catrecibosestatus/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    

    app.post(
        "/api/catrecibosestatus/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    
};