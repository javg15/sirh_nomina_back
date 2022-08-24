const { authJwt } = require("../middleware");
const controller = require("../controllers/catvariablesbase.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catvariablesbase/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catvariablesbase/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );

    app.post(
        "/api/catvariablesbase/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );
    app.post(
        "/api/catvariablesbase/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
};