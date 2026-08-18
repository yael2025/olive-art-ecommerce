const request = require("supertest");
const app = require("../app");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

describe("Products", () => {

    // Test #8 - Get all products successfully
    test("should return all products", async () => {

        await Product.create([
            {
                name: "Olive Wood Mezuzah",
                price: 120,
                description: "Handmade mezuzah",
                countInStock: 5,
                category: "Mezuzah",
            },
            {
                name: "Epoxy Menorah",
                price: 250,
                description: "Decorative menorah",
                countInStock: 3,
                category: "Menorah",
            },
        ]);

        const response = await request(app)
            .get("/api/products");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);

        const productNames = response.body.map((product) => product.name);

        expect(productNames).toContain("Olive Wood Mezuzah");
        expect(productNames).toContain("Epoxy Menorah");
    });

    // Test #9 - Return 404 when requesting a product that does not exist
    test("should return 404 for a non-existing product", async () => {
        const fakeId = "64b000000000000000000000";

        const response = await request(app)
            .get(`/api/products/${fakeId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Product not found");
    });

    // Test #10 - Allow an admin to create a new product
    test("should allow an admin to create a product", async () => {
        const admin = await User.create({
            username: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "admin",
            isAdmin: true,
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "admin@test.com",
                password: "123456",
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Olive Wood Candlesticks",
                price: 180,
                description: "Handmade olive wood candlesticks",
                image: "",
                countInStock: 4,
                category: "Candlesticks",
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe("Olive Wood Candlesticks");
        expect(response.body.price).toBe(180);
        expect(response.body.countInStock).toBe(4);

        const productInDb = await Product.findById(response.body._id);

        expect(productInDb).not.toBeNull();
        expect(productInDb.name).toBe("Olive Wood Candlesticks");
    });

    // Test #11 - Allow an admin to delete an existing product
    test("should allow an admin to delete an existing product", async () => {
        const admin = await User.create({
            username: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "admin",
            isAdmin: true,
        });

        const product = await Product.create({
            name: "Test Product",
            price: 100,
            description: "Product for delete test",
            image: "",
            countInStock: 2,
            category: "Test",
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "admin@test.com",
                password: "123456",
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .delete(`/api/products/${product._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Product removed");

        const deletedProduct = await Product.findById(product._id);

        expect(deletedProduct).toBeNull();
    });
});