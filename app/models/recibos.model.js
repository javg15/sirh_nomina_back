module.exports = function(sequelize, DataTypes) {
    return sequelize.define('recibos', {
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
        numero: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        anio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catrecibosestatus: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catrecibostipos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catfondopresupuestal: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catquincena_ini: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catquincena_fin: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_catquincena_aplicacion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_plazas: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        clavecobro: {
            type: DataTypes.STRING,
            allowNull: true
        },

        ignorarempparapasivos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ignorarreciboparadecanual: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fecharealpago: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        recibosustitucion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        recibotimbrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        aniopasivos: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pagatercero: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_personal_beneficiario: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        definirperiododiferente: {
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
        tableName: 'recibos',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};