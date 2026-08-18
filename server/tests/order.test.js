const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const bcrypt = require("bcryptjs");

describe("Orders", () => {

    // Test #12 - Create a new order successfully
    test("should create a new order successfully", async () => {

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

        const product = await Product.create({
            name: "Olive Wood Mezuzah",
            price: 120,
            description: "Handmade mezuzah",
            countInStock: 5,
            category: "Mezuzah",
        });

        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                orderItems: [
                    {
                        name: product.name,
                        qty: 2,
                        price: product.price,
                        category: product.category,
                        product: product._id,
                    },
                ],
                totalPrice: 240,
                shippingDetails: {
                    fullName: "Yael Test",
                    phone: "0500000000",
                    city: "Test City",
                    address: "Test Address 1",
                    shippingMethod: "Home Delivery",
                },
                customizationRequest: "Test engraving",
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.orderItems).toHaveLength(1);
        expect(response.body.totalPrice).toBe(240);
        expect(response.body.isPaid).toBe(false);
        expect(response.body.customizationRequest).toBe("Test engraving");
    });

    // Test #13 - Reduce product stock after creating an order
    test("should reduce product stock after creating an order", async () => {
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

        const product = await Product.create({
            name: "Olive Wood Mezuzah",
            price: 120,
            description: "Handmade mezuzah",
            countInStock: 5,
            category: "Mezuzah",
        });

        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                orderItems: [
                    {
                        name: product.name,
                        qty: 2,
                        price: product.price,
                        category: product.category,
                        product: product._id,
                    },
                ],
                totalPrice: 240,
                shippingDetails: {
                    fullName: "Yael Test",
                    phone: "0500000000",
                    city: "Test City",
                    address: "Test Address 1",
                    shippingMethod: "Home Delivery",
                },
            });

        expect(response.statusCode).toBe(201);

        const updatedProduct = await Product.findById(product._id);

        expect(updatedProduct.countInStock).toBe(3);
    });

    // Test #14 - Reject an order when requested quantity exceeds stock
    test("should reject an order when there is not enough stock", async () => {
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

        const product = await Product.create({
            name: "Olive Wood Mezuzah",
            price: 120,
            description: "Handmade mezuzah",
            countInStock: 2,
            category: "Mezuzah",
        });

        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                orderItems: [
                    {
                        name: product.name,
                        qty: 5,
                        price: product.price,
                        category: product.category,
                        product: product._id,
                    },
                ],
                totalPrice: 600,
                shippingDetails: {
                    fullName: "Yael Test",
                    phone: "0500000000",
                    city: "Test City",
                    address: "Test Address 1",
                    shippingMethod: "Home Delivery",
                },
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Not enough stock for Olive Wood Mezuzah"
        );

        const productAfterAttempt = await Product.findById(product._id);

        expect(productAfterAttempt.countInStock).toBe(2);
    });

    // Test #15 - Reject an order with no items
    test("should reject an order with no items", async () => {
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
            .post("/api/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                orderItems: [],
                totalPrice: 0,
                shippingDetails: {
                    fullName: "Yael Test",
                    phone: "0500000000",
                    city: "Test City",
                    address: "Test Address 1",
                    shippingMethod: "Home Delivery",
                },
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("No order items");
    });

    // Test #16 - Allow an admin to mark an order as paid
    test("should allow an admin to mark an order as paid", async () => {
        const customer = await User.create({
            username: "Customer",
            email: "customer@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "customer",
            isAdmin: false,
        });

        await User.create({
            username: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "admin",
            isAdmin: true,
        });

        const product = await Product.create({
            name: "Olive Wood Mezuzah",
            price: 120,
            countInStock: 5,
            category: "Mezuzah",
        });

        const order = await Order.create({
            user: customer._id,
            orderItems: [
                {
                    name: product.name,
                    qty: 1,
                    price: product.price,
                    product: product._id,
                },
            ],
            shippingDetails: {
                fullName: "Customer Test",
                phone: "0500000000",
                city: "Test City",
                address: "Test Address 1",
                shippingMethod: "Home Delivery",
            },
            totalPrice: 120,
            isPaid: false,
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "admin@test.com",
                password: "123456",
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .put(`/api/orders/${order._id}/pay`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.isPaid).toBe(true);
        expect(response.body.paidAt).toBeDefined();

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.isPaid).toBe(true);
        expect(updatedOrder.paidAt).not.toBeNull();
    });

    // Test #17 - Reject delivery of an unpaid order
    test("should not allow an unpaid order to be marked as delivered", async () => {
        const customer = await User.create({
            username: "Customer",
            email: "customer@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "customer",
            isAdmin: false,
        });

        await User.create({
            username: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "admin",
            isAdmin: true,
        });

        const product = await Product.create({
            name: "Olive Wood Mezuzah",
            price: 120,
            countInStock: 5,
            category: "Mezuzah",
        });

        const order = await Order.create({
            user: customer._id,
            orderItems: [
                {
                    name: product.name,
                    qty: 1,
                    price: product.price,
                    product: product._id,
                },
            ],
            shippingDetails: {
                fullName: "Customer Test",
                phone: "0500000000",
                city: "Test City",
                address: "Test Address 1",
                shippingMethod: "Home Delivery",
            },
            totalPrice: 120,
            isPaid: false,
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "admin@test.com",
                password: "123456",
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .put(`/api/orders/${order._id}/deliver`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Order must be paid before it can be delivered"
        );

        const unchangedOrder = await Order.findById(order._id);

        expect(unchangedOrder.isDelivered).toBe(false);
        expect(unchangedOrder.deliveredAt).toBeUndefined();
    });

    // Test #18 - Allow an admin to mark a paid order as delivered
    test("should allow a paid order to be marked as delivered", async () => {
        const customer = await User.create({
            username: "Customer",
            email: "customer@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "customer",
            isAdmin: false,
        });

        await User.create({
            username: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "admin",
            isAdmin: true,
        });

        const product = await Product.create({
            name: "Olive Wood Mezuzah",
            price: 120,
            countInStock: 5,
            category: "Mezuzah",
        });

        const order = await Order.create({
            user: customer._id,
            orderItems: [
                {
                    name: product.name,
                    qty: 1,
                    price: product.price,
                    product: product._id,
                },
            ],
            shippingDetails: {
                fullName: "Customer Test",
                phone: "0500000000",
                city: "Test City",
                address: "Test Address 1",
                shippingMethod: "Home Delivery",
            },
            totalPrice: 120,
            isPaid: true,
            paidAt: new Date(),
            isDelivered: false,
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "admin@test.com",
                password: "123456",
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .put(`/api/orders/${order._id}/deliver`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.isDelivered).toBe(true);
        expect(response.body.deliveredAt).toBeDefined();

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.isDelivered).toBe(true);
        expect(updatedOrder.deliveredAt).not.toBeNull();
    });

});