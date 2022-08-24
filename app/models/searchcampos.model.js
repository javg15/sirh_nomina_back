module.exports = function(sequelize, DataTypes) {
    return sequelize.define('searchcampos', {
        
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        etiqueta: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: ""
        },
        campo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ""
        },
        id_modulos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        tipo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        orden: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
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
        tableName: 'searchcampos',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};