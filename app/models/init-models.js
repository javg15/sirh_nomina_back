/*var DataTypes = require("sequelize").DataTypes;
var _categorias = require("./categorias");
var _calendarios = require("./calendarios");
var _catcentrostrabajo = require("./catcentrostrabajo");
var _catestatusplaza = require("./catestatusplaza");
var _catfuentef = require("./catfuentef");
var _catlocalidades = require("./catlocalidades");
var _catmunicipios = require("./catmunicipios");
var _catestados = require("./catestados");
var _catplanteles = require("./catplanteles");
var _catregiones = require("./catregiones");
var _cattipocategoria = require("./cattipocategoria");
var _cattiponomina = require("./cattiponomina");
var _catzonaeconomica = require("./catzonaeconomica");
var _catzonasgeograficas = require("./catzonasgeograficas");
var _ejercicioreal = require("./ejercicioreal");
var _estudios = require("./estudios");
var _horas = require("./horas");
var _log = require("./log");
var _ministraciones = require("./ministraciones");
var _modulos = require("./modulos");
var _permgrupos = require("./permgrupos");
var _permgruposmodulos = require("./permgruposmodulos");
var _permusuariosmodulos = require("./permusuariosmodulos");
var _presupuesto = require("./presupuesto");
var _rhnominas = require("./rhnominas");
var _searchcampos = require("./searchcampos");
var _searchoperador = require("./searchoperador");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
    var _categorias = _categorias(sequelize, DataTypes);
    var calendarios = _calendarios(sequelize, DataTypes);
    var catcentrostrabajo = _catcentrostrabajo(sequelize, DataTypes);
    var catestatusplaza = _catestatusplaza(sequelize, DataTypes);
    var catfuentef = _catfuentef(sequelize, DataTypes);
    var catlocalidades = _catlocalidades(sequelize, DataTypes);
    var catmunicipios = _catmunicipios(sequelize, DataTypes);
    var catestados = _catestados(sequelize, DataTypes);
    var catplanteles = _catplanteles(sequelize, DataTypes);
    var catregiones = _catregiones(sequelize, DataTypes);
    var cattipocategoria = _cattipocategoria(sequelize, DataTypes);
    var cattiponomina = _cattiponomina(sequelize, DataTypes);
    var catzonaeconomica = _catzonaeconomica(sequelize, DataTypes);
    var catzonasgeograficas = _catzonasgeograficas(sequelize, DataTypes);
    var ejercicioreal = _ejercicioreal(sequelize, DataTypes);
    var estudios = _estudios(sequelize, DataTypes);
    var horas = _horas(sequelize, DataTypes);
    var log = _log(sequelize, DataTypes);
    var ministraciones = _ministraciones(sequelize, DataTypes);
    var modulos = _modulos(sequelize, DataTypes);
    var permgrupos = _permgrupos(sequelize, DataTypes);
    var permgruposmodulos = _permgruposmodulos(sequelize, DataTypes);
    var permusuariosmodulos = _permusuariosmodulos(sequelize, DataTypes);
    var presupuesto = _presupuesto(sequelize, DataTypes);
    var rhnominas = _rhnominas(sequelize, DataTypes);
    var searchcampos = _searchcampos(sequelize, DataTypes);
    var searchoperador = _searchoperador(sequelize, DataTypes);
    var usuarios = _usuarios(sequelize, DataTypes);


    return {
        calendarios,
        categorias,
        catcentrostrabajo,
        catestatusplaza,
        catfuentef,
        catlocalidades,
        catmunicipios,
        catplanteles,
        catregiones,
        cattipocategoria,
        cattiponomina,
        catestados,
        catzonaeconomica,
        catzonasgeograficas,
        ejercicioreal,
        estudios,
        horas,
        log,
        ministraciones,
        modulos,
        permgrupos,
        permgruposmodulos,
        permusuariosmodulos,
        presupuesto,
        rhnominas,
        searchcampos,
        searchoperador,
        usuarios,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;*/