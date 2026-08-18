const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const bcrypt = require("bcryptjs");

describe("Categories", () => {

  // Test #19 - Reject creation of a duplicate category
  test("should reject creating a duplicate category", async () => {
    await User.create({
      username: "Admin",
      email: "admin@test.com",
      password: await bcrypt.hash("123456", 10),
      role: "admin",
      isAdmin: true,
    });

    await Category.create({
      name: "Mezuzah",
    });

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({
        email: "admin@test.com",
        password: "123456",
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Mezuzah",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Category already exists");

    const categories = await Category.find({
      name: "Mezuzah",
    });

    expect(categories).toHaveLength(1);
  });

});