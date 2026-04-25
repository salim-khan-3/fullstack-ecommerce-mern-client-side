# 🛒 FullStack E-Commerce Platform

A full-stack e-commerce web application built with the **MERN Stack**, featuring a customer-facing storefront, admin dashboard, and integrated payment gateway.

---

## 🚀 Live Demo

| Platform | URL |
|----------|-----|
| 🛍️ Frontend | [fullstack-ecommerce-project.netlify.app](https://fullstack-ecommerce-project.netlify.app) |
| ⚙️ Admin Dashboard | [fullstack-admin-dashboard.netlify.app](https://fullstack-admin-dashboard.netlify.app) |
| 🔗 Backend API | [fulls-stack-ecommerce-mern-server-s.vercel.app](https://fulls-stack-ecommerce-mern-server-s.vercel.app) |

---

## 🧰 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### Services
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

---

## ✨ Features

### 🛍️ Customer Storefront
- JWT-based authentication (Sign Up / Sign In)
- Product listing with search, category, subcategory & brand filtering
- Product quick view modal with zoom
- Cart management with real-time quantity & stock validation
- Wishlist (My List) with add/remove toggle
- SSLCommerz payment gateway — bKash, Nagad, Rocket, Card
- Order placement & tracking
- Product reviews & ratings
- Profile management with image upload (Cloudinary)
- Password change
- Responsive design — mobile, tablet, desktop

### ⚙️ Admin Dashboard
- Secure admin-only access (role-based JWT)
- Order management — view all orders, update status
- Product CRUD — create, edit, delete with image upload
- Home banner management — multiple image upload/delete
- User management
- Stats overview

### 🔧 Backend
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- Cloudinary integration for image storage
- Multer for multipart/form-data handling
- Real-time stock validation on order placement
- SSLCommerz payment callback handling
- CORS configured for multiple origins

---

## 📁 Project Structure

```
├── fullstack-ecommerce-client/     # Customer frontend (React)
├── fullstack-ecommerce-admin/      # Admin dashboard (React)
└── fullstack-ecommerce-server/     # Backend API (Node.js + Express)
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: https://github.com/selimIslamDev
- LinkedIn: www.linkedin.com/in/mdsalimislamdev

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
