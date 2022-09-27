module.exports = function(sequelize, DataTypes) {
    return sequelize.define('catdeducciones', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        clave: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gravar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        federalestatal: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_partida: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ambito: {
            type: DataTypes.STRING,
            allowNull: true
        },
        funcioncalculo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        datoextra: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catpercepciones_afectada:{
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
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'catdeducciones',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};