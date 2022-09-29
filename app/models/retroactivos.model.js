module.exports = function(sequelize, DataTypes) {
    return sequelize.define('retroactivos', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_catpercepciones: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catzonaeconomica: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_cattipocategoria: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        calificadorempleado: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catquincena_aplicacion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catquincena_ini: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catquincena_fin: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        porcentaje: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        importe: {
            type: DataTypes.REAL,
            allowNull: true
        },
        incluirenpago: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'retroactivos',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        
    });
};