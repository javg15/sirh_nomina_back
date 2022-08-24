module.exports = function(sequelize, DataTypes) {
    return sequelize.define('searchoperador', {
        
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tipo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        etiqueta: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        operador: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        orden: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
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
        }
    }, {
        sequelize,
        tableName: 'searchoperador',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};