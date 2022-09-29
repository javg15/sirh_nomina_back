module.exports = function(sequelize, DataTypes) {
    return sequelize.define('compensaciones', {
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
        origen: {
            type: DataTypes.STRING,
            allowNull: true
        },
        importe: {
            type: DataTypes.REAL,
            allowNull: true
        },
        id_catmes: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        anio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pagarconcheque: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        clavecobro: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catbancos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cuentabancaria: {
            type: DataTypes.STRING,
            allowNull: true
        },
        adicional: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        mesesqueampara: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.STRING,
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
        tableName: 'compensaciones',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};