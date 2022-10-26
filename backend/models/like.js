'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {

    static associate(models) {
      // define association here
      models.Like.belongsTo(models.Post, {
        foreignKey: 'postId'
      })
      models.Like.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  };
  Like.init({
	like: DataTypes.BOOLEAN,
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};