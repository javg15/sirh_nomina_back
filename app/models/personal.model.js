/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('personal', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        curp: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        rfc: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        homoclave: {
            type: DataTypes.STRING(13),
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(70),
            allowNull: false
        },
        apellidopaterno: {
            type: DataTypes.STRING(70),
            allowNull: false
        },
        apellidomaterno: {
            type: DataTypes.STRING(70),
            allowNull: false
        },
        id_catestadocivil: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sexo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fechanacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        id_catestadosresi: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_catmunicipiosresi: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_catlocalidadesresi: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_catestadosnaci: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_catmunicipiosnaci: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_catlocalidadesnaci: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_archivos_avatar: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_usuarios_sistema: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(70),
            allowNull: false
        },
        emailoficial: {
            type: DataTypes.STRING(70),
            allowNull: false
        },
        observaciones: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        numeemp: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        domicilio: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        colonia: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        cp: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        telefonomovil: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        numimss: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        numissste: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        otronombre: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        numotro: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        tipopension: {
            type: DataTypes.STRING(6),
            allowNull: true
        },
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        state: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: "A"
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fechaingreso: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        primaantiguedad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        id_catbanco_deposito: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        cuentadeposito: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        formacobro: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        sequelize,
        tableName: 'personal',
        schema: 'public',
        //timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};