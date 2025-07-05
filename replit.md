# DripTech Irrigation Website

## Overview

DripTech is a comprehensive irrigation solutions website built with modern web technologies. The application serves as a platform for showcasing premium irrigation products, managing customer quotes, and providing detailed project information. It features a React frontend with TypeScript, a Node.js/Express backend, and PostgreSQL database integration through Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Theme System**: Custom theme provider with light/dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Design**: RESTful API endpoints under `/api` namespace

### Database Schema
- **Users**: Role-based access control (user, admin, super_admin)
- **Products**: Comprehensive product catalog with categories, specifications, and inventory
- **Quotes**: Customer quote management with status tracking
- **Projects**: Project portfolio with detailed information
- **Blog Posts**: Content management for blog articles
- **Contacts**: Customer inquiry management

## Key Components

### Public Pages
- **Home**: Hero section with featured products and projects
- **Products**: Filterable product catalog with search functionality
- **Services**: Service offerings and process descriptions
- **Projects**: Portfolio showcase with project details
- **About**: Company information and team profiles
- **Contact**: Contact form and company information
- **Blog**: Article listing and content management
- **Quote**: Quote request form with package options

### Admin Dashboard
- **Login**: Secure authentication for admin access
- **Dashboard**: Overview of system metrics and recent activity
- **Products**: CRUD operations for product management
- **Quotes**: Quote management and PDF generation
- **Users**: User management and role assignment

### UI Components
- **shadcn/ui**: Comprehensive component library with consistent design
- **Product Cards**: Reusable product display components
- **Quote Forms**: Multi-step quote generation forms
- **Theme Toggle**: Light/dark mode switching
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Server validates credentials and generates JWT token
3. Token stored in localStorage for subsequent requests
4. Protected routes verify token validity through middleware

### Product Management
1. Admin creates/updates products through admin interface
2. Product data stored in PostgreSQL with Drizzle ORM
3. Public product pages fetch data through API endpoints
4. Product filtering and search implemented client-side

### Quote Generation
1. Customer submits quote request through public form
2. Quote data stored with "pending" status
3. Admin reviews and updates quotes through admin dashboard
4. PDF generation available for completed quotes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **bcrypt**: Password hashing for security
- **jsonwebtoken**: JWT token generation and verification

### UI Dependencies
- **@radix-ui**: Accessible primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
1. Frontend: Vite builds React application to `dist/public`
2. Backend: esbuild compiles TypeScript server to `dist/index.js`
3. Database: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **JWT_SECRET**: Secret key for JWT token signing
- **NODE_ENV**: Environment mode (development/production)

### Production Deployment
- Server serves static files from `dist/public` directory
- Express API handles dynamic content and authentication
- PostgreSQL database managed through Drizzle schema migrations

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```