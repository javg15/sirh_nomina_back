module.exports = (sequelize, DataTypes) => {
    return sequelize.define('usuarios', {
        
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        pass: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        u_passenc: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        perfil: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        numemp: {
            type: DataTypes.STRING(6),
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
        },
        state: {
            type: DataTypes.CHAR(1),
            allowNull: true,
            defaultValue: "A"
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_archivos_avatar: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'usuarios',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};