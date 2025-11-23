# Addiscart 🛒

A modern, full-stack e-commerce grocery delivery platform inspired by Instacart. Built with Next.js, Express, MongoDB, and optimized for production deployment.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://addiscart.vercel.app)
[![Backend API](https://img.shields.io/badge/api-railway-blueviolet)](https://addiscart-production.up.railway.app)

## Features

- User authentication and profile management
- Store and product browsing with search functionality
- Shopping cart and checkout process
- Order history and tracking
- Payment processing
- Delivery scheduling and tracking

## Tech Stack

### Frontend

- React with Next.js
- TailwindCSS for styling
- shadcn/ui for components
- React Query for data fetching

### Backend

- Node.js with Express
- MongoDB for database
- JWT for authentication
- Stripe for payment processing

## Project Structure

```
/
├── backend/           # Express server
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── utils/         # Utility functions
│
├── frontend/          # Next.js application
│   ├── app/           # App router
│   ├── components/    # React components
│   ├── lib/           # Utility functions
│   ├── public/        # Static assets
│   └── styles/        # Global styles
│
├── deploy.sh          # Deployment script
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB

### Quick Start

The easiest way to get started is to use the deployment script:

```bash
./deploy.sh
```

This script will:

1. Check if MongoDB is running
2. Install all dependencies
3. Seed the database with sample data
4. Start both the backend and frontend servers

### Manual Installation

1. Install root dependencies:

   ```bash
   npm install
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Seed the database:
   ```bash
   cd backend
   npm run seed
   ```

### Running the Application Manually

1. Start both servers from the root directory:

   ```bash
   npm run dev
   ```

2. Or start them separately:
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

## Environment Variables

### Backend (.env file)

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `STRIPE_SECRET_KEY` - Stripe API secret key

### Frontend (.env.local file)

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Stripe public key

## Default Users

After seeding the database, you can log in with these accounts:

- **Admin User**:

  - Email: admin@example.com
  - Password: password123

- **Customer**:

  - Email: user@example.com
  - Password: password123

- **Shopper**:
  - Email: shopper@example.com
  - Password: password123

## API Documentation

The API endpoints are organized by resource:

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/stores` - Store listings and details
- `/api/products` - Product listings and details
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order processing and history
- `/api/payments` - Payment processing

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Full deployment instructions
- **[Quick Deploy](./docs/QUICK_DEPLOY.md)** - Fast deployment steps
- **[Security Guide](./docs/SECURITY.md)** - Security best practices
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Documentation Index](./docs/README.md)** - Complete documentation list

## 🚀 Production Deployment

This application is production-ready and deployed on:

- **Frontend**: Vercel - [https://addiscart.vercel.app](https://addiscart.vercel.app)
- **Backend**: Railway - [https://addiscart-production.up.railway.app](https://addiscart-production.up.railway.app)
- **Database**: MongoDB Atlas

For deployment instructions, see [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md).

## 🔒 Security

This application implements:

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- XSS protection headers
- Rate limiting (recommended for production)

For security details, see [Security Guide](./docs/SECURITY.md).

## 📱 Mobile Responsive

Fully responsive design optimized for:

- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Bisrat Gizaw**

- GitHub: [@BisratJ](https://github.com/BisratJ)
- Project: [addiscart](https://github.com/BisratJ/addiscart)
