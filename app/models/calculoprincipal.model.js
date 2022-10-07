module.exports = function(sequelize, DataTypes) {
    return sequelize.define('calculoprincipal', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_catquincena: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        id_catestatusplaza: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_personalhoras: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        horaslaboradas: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_cattiponomina: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catquincena_aplicacion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        retroactivo: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        diaspago: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        diasantiguedad: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        esplazabase: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        esvigente: {
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
        
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'calculoprincipal',
        schema: 'public',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};