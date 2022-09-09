module.exports = function(sequelize, DataTypes) {
    return sequelize.define('categorias', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        clave: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        denominacion: {
            type: DataTypes.STRING(75),
            allowNull: true
        },
        nivelsalarial: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        id_cattipocategoria: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_tiponomina: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        aplicaa: {
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
        state: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: "A"
        },
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'categorias',
        schema: 'public',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};