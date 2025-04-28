# AirSecure

<div align="center">
  
![AirSecure](./assets/images/dark-logo.svg)

**Web Application for a hardware-based network security tool called AirSecure**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

AirSecure is a production-ready authentication system built on Next.js and PostgreSQL. It provides a secure, scalable foundation for web applications requiring user authentication, featuring JWT-based security with HttpOnly cookies and a clean, responsive UI powered by Material UI. It acts as a front-end for our Machine Learning and Hardware based tool for flagging RougeAps and Evil Twin networks.

## Features

- **Secure Authentication**
  - JWT-based authentication with HttpOnly cookies
  - Protected routes via middleware
  - Robust session management
  
- **User Management**
  - User registration and login flows
  - Profile customization
  - Role-based access control
  
- **Modern UI**
  - Responsive design with Material UI components
  - Emotion-based styling system
  - Consistent visual language
  
- **Developer Experience**
  - Modular architecture for easy extension
  - Type-safe development
  - Comprehensive documentation

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js (App Router), React, Material UI, Emotion |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL |
| **Authentication** | JWT, HttpOnly cookies |
| **DevOps** | Docker support |

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL instance
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/airsecure.git
   cd airsecure
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables  
   Create a `.env.local` file in the root directory:
   ```
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_db_name
   JWT_SECRET=your_secure_secret_key
   ```

4. Set up the database
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

For production environments, consider the following best practices:

1. Set up proper environment variables
2. Configure a production-ready PostgreSQL instance
3. Use a process manager like PM2 or containerize with Docker
4. Set up monitoring and logging

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Material UI](https://mui.com/) - React UI Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
