const request = require("supertest");
const app = require("../app");
const Product = require("../models/productModel");

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

});