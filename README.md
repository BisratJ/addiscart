# Instacart Clone

A full-stack application that mimics the core functionality of Instacart, allowing users to browse stores, shop for groceries, and place orders for delivery.

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

Detailed API documentation can be found by exploring the route files in the backend/routes directory.
