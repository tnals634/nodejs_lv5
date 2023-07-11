"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post_likes", {
      post_like_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      User_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users", // users 모델을 참조합니다.
          key: "user_id", // Users 모델의 user_id를 참조합니다.
        },
        onDelete: "CASCADE",
      },
      Post_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "posts", // posts 모델을 참조합니다.
          key: "post_id", // posts 모델의 post_id를 참조합니다.
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("post_likes");
  },
};
