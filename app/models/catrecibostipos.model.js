module.exports = function(sequelize, DataTypes) {
    return sequelize.define('catrecibostipos', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        clave: {
            type: DataTypes.STRING,
            allowNull: true
        },

        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },

        afectaissste: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        excluirparaissste: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        permitecapturadatoscomp: {
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
        tableName: 'catrecibostipos',
        schema: 'nomina',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};