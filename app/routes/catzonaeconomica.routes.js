const { authJwt } = require("../middleware");
const controller = require("../controllers/catzonaeconomica.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catzonaeconomica/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
    app.post(
        "/api/catzonaeconomica/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catzonaeconomica/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
};