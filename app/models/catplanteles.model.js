module.exports = function(sequelize, DataTypes) {
    return sequelize.define('catplanteles', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_catcentrostrabajo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        clave: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catzonaeconomica: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catzonageografica: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        adscrip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        aniocreacion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catzonaeconomica2: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catregion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catplantelesasociado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tipoplantel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        clavectse: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catturnos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        domicilio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitud: {
            type: DataTypes.STRING,
            allowNull: true
        },
        longitud: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emsad: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catlocalidades: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catmunicipios: {
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
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'catplanteles',
        schema: 'public',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};