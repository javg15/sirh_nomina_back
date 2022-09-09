/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('catquincena', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quincena: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechainicio: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        fechafin: {
            type: DataTypes.DATEONLY,
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
        adicional: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catestatusquincena: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        periodovacacional: {
            type: DataTypes.STRING(4),
            allowNull: true
        },
        fechadepago: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.STRING(133),
            allowNull: true
        },
        fechacierre: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        observaciones2: {
            type: DataTypes.STRING(69),
            allowNull: true
        },
        bimestre: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aplicarajusteispt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pagoderetroactividad: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        liberadaparaportaladmvo: {
            type: DataTypes.STRING(4),
            allowNull: true
        },
        permiteabcderecibos: {
            type: DataTypes.STRING(4),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'catquincena',
        //timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};