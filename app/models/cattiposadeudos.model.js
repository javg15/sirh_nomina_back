module.exports = function(sequelize, DataTypes) {
    return sequelize.define('cattiposadeudos', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catplantillas: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        condias: {
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
        tableName: 'cattiposadeudos',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};