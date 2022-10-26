'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {

    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      models.Post.hasMany(models.Comment, {
        onDelete: 'CASCADE',
        hooks: true
      });
      models.Post.hasMany(models.Like, {
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  };
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
