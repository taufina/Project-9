'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: "First name is required"
        },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: "Last name is required"
        },
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: "Email address is required"
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: "Password is required"
        },
      }
    }
  }, {sequelize});

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Course, { 
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };
  return User;
};