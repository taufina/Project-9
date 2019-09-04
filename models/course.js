'use strict';

// const User = require("./User");
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Course = sequelize.define('Course', {
      title: {
      type: DataTypes.STRING,
      // allowNull: false,
      // unique: true,
      validate:{
        notEmpty:{
          msg: "Title is required"
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
      // allowNull: false,
      // unique: true,
      validate: {
        notEmpty: {
          msg: "Description is required"
        },
        // notNull: {
        //   msg: "Must contain a description property"
        // }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  
  Course.associate = (models) => {
//Course" belongs to a single "User
    Course.belongsTo(models.User, {
      // foreignKey: 'userId',
      // },
      foreignKey: {
        fieldName: 'userId',
        allowNull:false,
      },
    });
  };
  return Course;
};