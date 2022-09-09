module.exports = function(sequelize, DataTypes) {
    return sequelize.define('catzonaeconomica', {
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
        porcentaje: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        state: {
            type: DataTypes.CHAR(1),
            allowNull: true,
            defaultValue: "A"
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_usuarios_r: {
            type: DataTypes.INTEGER,
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
    }, {
        sequelize,
        tableName: 'catzonaeconomica',
        schema: 'public',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};