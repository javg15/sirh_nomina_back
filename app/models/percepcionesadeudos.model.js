module.exports = function(sequelize, DataTypes) {
    return sequelize.define('percepcionesadeudos', {
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
        id_cattiposadeudos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catquincena_aplicacion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        dias: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catquincena: {
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
        tableName: 'percepcionesadeudos',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};