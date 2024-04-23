// models/student.js
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database'); // Import your database connection here

class Student extends Model {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

Student.init(
  {
    stu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    class: {
      type: DataTypes.INTEGER, // Ensure that it is defined as an INTEGER
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'student',
    timestamps: false,
    hooks: {
      beforeCreate: async (student) => {
        const hashedPassword = await bcrypt.hash(student.password, 10);
        student.password = hashedPassword;
      },
    },
  }
);

module.exports = Student;
