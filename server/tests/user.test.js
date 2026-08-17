
const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");

describe("User Registration", () => {

    // Test #1 - Register a new user successfully
    test("should register a new user successfully", async () => {
        const response = await request(app)
            .post("/api/users/register")
            .send({
                username: "Yael",
                email: "yael@test.com",
                password: "123456",
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty("_id");
        expect(response.body.username).toBe("Yael");
        expect(response.body.email).toBe("yael@test.com");
        expect(response.body.isAdmin).toBe(false);

        const userInDb = await User.findOne({
            email: "yael@test.com",
        });

        expect(userInDb).not.toBeNull();
    });

    // Test #2 - Prevent registration with an existing email
    test("should not register a user with an existing email", async () => {
        await request(app)
            .post("/api/users/register")
            .send({
                username: "Yael",
                email: "yael@test.com",
                password: "123456",
            });

        const response = await request(app)
            .post("/api/users/register")
            .send({
                username: "Another User",
                email: "yael@test.com",
                password: "654321",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User already exists");
    });
});

describe("User Login", () => {
    // Test #3 - Login successfully with valid credentials
    test("should login successfully with valid credentials", async () => {
        await request(app)
            .post("/api/users/register")
            .send({
                username: "Yael",
                email: "yael@test.com",
                password: "123456"
            })

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "yael@test.com",
                password: "123456"
            })

        expect(response.statusCode).toBe(200)

        expect(response.body.email).toBe("yael@test.com")
        expect(response.body.username).toBe("Yael")
        expect(response.body.isAdmin).toBe(false)

        expect(response.body).toHaveProperty("token")
        expect(response.body.token).toBeTruthy();
    })

    // Test #4 - Reject login with an incorrect password
    test("should not login with incorrect password", async () => {
        await request(app)
            .post("/api/users/register")
            .send({
                username: "Yael",
                email: "yael@test.com",
                password: "123456",
            });

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "yael@test.com",
                password: "wrongpassword",
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
    });
});

describe("Authentication Middleware", () => {

    // Test #5 - Allow access to a protected route with a valid token
    test("should allow access with a valid token", async () => {

        const registerResponse = await request(app)
            .post("/api/users/register")
            .send({
                username: "Yael",
                email: "yael@test.com",
                password: "123456",
            });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "yael@test.com",
                password: "123456",
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .get("/api/test-protected")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("You are authorized");
        expect(response.body.user.email).toBe("yael@test.com");
    });

    // Test #6 - Reject access to a protected route without a token
    test("should reject access without a token", async () => {
        const response = await request(app)
            .get("/api/test-protected");

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("No token");
    });

});

describe("Admin Authorization", () => {

  // Test #7 - Reject a regular customer from accessing an admin-only route
  test("should reject a customer from creating a product", async () => {

    await request(app)
      .post("/api/users/register")
      .send({
        username: "Yael",
        email: "yael@test.com",
        password: "123456",
      });

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({
        email: "yael@test.com",
        password: "123456",
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Mezuzah",
        price: 120,
        description: "Test product",
        image: "",
        countInStock: 5,
        category: "Mezuzah",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Admin access only");
  });

});