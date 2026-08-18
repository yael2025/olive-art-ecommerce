# 🫒 Olive Art Creations

### Handmade Judaica E-Commerce Platform

Olive Art Creations is a full-stack e-commerce web application developed as a graduation project.

The platform represents a small family business specializing in handmade Judaica products created from **olive wood and epoxy resin**, combining traditional craftsmanship with modern technology.

The system allows customers to browse products, manage a shopping cart and wishlist, submit personalized orders, and track their orders.

Administrators can manage products, categories, orders and users, as well as view business analytics through a dedicated dashboard.

---

## ✨ Main Features

### 👤 Customer Features

- User registration and login
- JWT-based authentication
- Browse the product catalog
- Search and filter products
- Filter products by category and price
- View detailed product information
- Add products to the shopping cart
- Manage product quantities
- Add and remove products from a wishlist
- Submit personalization and customization requests
- Review an order before submission
- Submit orders
- View personal order history

### 🛠️ Admin Features

- Admin-protected routes
- Product management
- Category management
- Order management
- User management
- Order status updates
- Business analytics dashboard
- Product and sales statistics
- Revenue analysis
- Top-selling products
- Sales analysis by category

### 🎨 Product Personalization

Olive Art Creations specializes in handmade products that can be customized according to customer preferences.

Customization options may include:

- Personal engraving
- Epoxy color selection
- Size adjustments
- Gift packaging
- Special design requests

The final price may vary depending on the requested customization and design complexity.

---

## 🤖 AI Features

The project also integrates AI-based functionality designed to improve both the customer and administrator experience.

AI functionality includes tools for assisting users with product-related interactions and supporting administrative content creation.

---

## 📊 Business Analytics

The administration dashboard provides business insights based on system data.

The dashboard includes:

- Total orders
- Total revenue
- Average order value
- Registered users
- Orders by status
- Top-selling products
- Sales by category

Charts and visualizations are implemented using **Recharts**.

Analytics data can also be exported for further use.

---

## 🧰 Technologies

### Frontend

- ⚛️ React
- ⚡ Vite
- 🧭 React Router
- 🌐 Axios
- 🔔 React Hot Toast
- 📊 Recharts
- 📄 XLSX

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB
- 🔗 Mongoose
- 🔐 JWT Authentication
- 🔑 bcrypt

### Testing

- 🧪 Jest
- 🔬 Supertest
- 🗄️ MongoDB Memory Server
- ⚡ Vitest
- 🧩 React Testing Library
- 👆 User Event
- 🌐 jsdom

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman
- Docker

---

## 🏗️ Project Architecture

The application follows a client-server architecture:

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Node.js + Express Backend
      │
      ▼
MongoDB Database
```

The frontend communicates with the backend through REST API requests.

The backend is responsible for business logic, authentication, authorization, order processing, product management and database access.

---

## 📁 Project Structure

```text
judaica-final-project/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── tests/
│   │
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── tests/
│
└── README.md
```

---

## 🔐 Authentication & Authorization

Authentication is implemented using **JSON Web Tokens (JWT)**.

Protected routes require a valid authentication token.

Role-based authorization is used to restrict administrative functionality.

Examples:

- Customers can access their personal orders and wishlist.
- Administrators can manage products, categories and orders.
- Administrative routes are protected on both the frontend and backend.

---

## 🛒 Order Flow

The order process follows the following flow:

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart
      ↓
Cart
      ↓
Shipping & Personalization Details
      ↓
Order Review
      ↓
Submit Order
      ↓
My Orders
```

Because the project does not process real payments, the final step is implemented as an **Order Confirmation** process rather than a payment transaction.

Customers review their order and personalization requests before submitting it.

---

## 🧪 Automated Testing

Automated tests were implemented for both the backend and frontend.

### Backend Testing

The backend contains **20 automated tests** covering core functionality such as:

- User registration
- Duplicate user prevention
- User login
- Invalid credentials
- JWT authentication
- Authorization
- Product operations
- Order operations
- Inventory updates
- Categories
- Dashboard analytics

**Backend test results:**

```text
Test Suites: 5 passed
Tests:       20 passed
```

#### Backend Code Coverage

| Metric | Coverage |
|---|---:|
| Statements | 69.26% |
| Branches | 45.16% |
| Functions | 56.52% |
| Lines | 69.04% |

### Frontend Testing

The frontend contains **6 automated tests** covering:

- Product rendering
- Adding products to the shopping cart
- Removing products from the shopping cart
- Protected admin routes
- Wishlist functionality
- Order confirmation and submission flow

**Frontend test results:**

```text
Test Files: 5 passed
Tests:      6 passed
```

#### Frontend Code Coverage

| Metric | Coverage |
|---|---:|
| Statements | 65.87% |
| Branches | 44.68% |
| Functions | 57.77% |
| Lines | 65.04% |

### ✅ Overall Testing Result

**26 / 26 automated tests passed successfully.**

---

## ▶️ Running the Project Locally

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Variables

Create a `.env` file inside the server directory and configure the required environment variables.

> ⚠️ The `.env` file should never be committed to GitHub.

### 5. Start the Backend

From the `server` directory:

```bash
npm run dev
```

### 6. Start the Frontend

From the `client` directory:

```bash
npm run dev
```

---

## 🧪 Running Tests

### Backend Tests

From the `server` directory:

```bash
npm test
```

### Backend Coverage

```bash
npm test -- --coverage
```

### Frontend Tests

From the `client` directory:

```bash
npm test
```

### Frontend Coverage

```bash
npm run test:coverage
```

---

## 🐳 Docker

Docker support is planned as part of the deployment stage.

The application will be containerized so that the frontend, backend and database can run in isolated environments.

> Docker configuration will be added in the next development stage.

---

## 🚀 Deployment

Deployment configuration will be added after the Dockerization process is completed.

A live application URL will be added here once deployment is available.

---

## 🔒 Security

The application includes several security mechanisms:

- Password hashing
- JWT authentication
- Protected API routes
- Role-based authorization
- Admin-only operations
- Environment variables for sensitive configuration
- Backend validation and error handling

---

## 🌿 About Olive Art Creations

Olive Art Creations is a family project combining traditional craftsmanship with modern technology.

Each product is handmade using olive wood, epoxy resin and personalized engraving techniques.

The physical creation process is handled by an experienced craftsman, while the digital platform was designed and developed to bring the products and customization process online.

---

## 👩‍💻 Developer

**Yael**

Full-Stack MERN Graduation Project

Technologies: React • Node.js • Express • MongoDB

---

## 📌 Project Status

```text
✅ Full-Stack Application
✅ Authentication & Authorization
✅ Product Management
✅ Shopping Cart
✅ Wishlist
✅ Order Management
✅ Product Personalization
✅ Admin Panel
✅ Business Analytics
✅ Automated Backend Testing
✅ Automated Frontend Testing
🔄 Dockerization
⏳ Deployment
```

---

### 🫒 Olive Art Creations

**Traditional craftsmanship. Modern technology. Meaningful creations.**