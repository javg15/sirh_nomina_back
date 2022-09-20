module.exports = function(sequelize, DataTypes) {
    return sequelize.define('percepcionescaptura', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_personal: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_plantillasdocsnombramiento: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_plazas: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catpercepciones: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        importetotal: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        diasapagar: {
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
        cantidadquincenas: {
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
        tableName: 'percepcionescaptura',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};