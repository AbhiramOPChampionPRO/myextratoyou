# MyExtraToYou - Book Sharing Platform

## Overview

MyExtraToYou is a comprehensive book sharing platform that enables users to donate books, browse available collections, and facilitate transactions within local communities. The platform features a complete user authentication system, transaction management, seller ratings, and help support functionality. It's designed to promote knowledge sharing and build community connections through book exchanges.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React-based SPA**: Built using React with TypeScript for type safety and improved developer experience
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives for consistent, accessible UI elements
- **Styling System**: Tailwind CSS with CSS custom properties for theming, supporting both light and dark modes
- **State Management**: React Query (TanStack Query) for server state management with caching and synchronization
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Express.js Server**: RESTful API server handling authentication, book management, transactions, and help requests
- **TypeScript Implementation**: Fully typed backend with shared schema definitions between client and server
- **Middleware Stack**: Request logging, JSON parsing, and error handling middleware
- **Storage Abstraction**: Interface-based storage system allowing for easy switching between implementations (currently in-memory, designed for database integration)

### Authentication System
- **Password Security**: Bcrypt hashing for secure password storage
- **Session Management**: Client-side user state management with localStorage persistence
- **Account Status**: Tracks user ratings and implements temporary banning for users with excessive rejections

### Data Models
- **Users**: Name, email, password, contact details, location (state/district), star ratings, rejection count, ban status
- **Books**: Title, topic, language, price, seller reference, images array, availability status
- **Transactions**: Book-buyer-seller relationships with status tracking (pending/completed/rejected)
- **Help Requests**: User support tickets with categorization and status management

### Database Design
- **PostgreSQL Integration**: Configured with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory for consistency
- **Migration System**: Drizzle Kit for database schema migrations and management

### Rating and Moderation System
- **Seller Ratings**: Dynamic star system based on successful transactions (+1) and rejections (-1)
- **Account Moderation**: Automatic temporary banning for users with 5+ rejections
- **Transaction Tracking**: Complete audit trail of all book exchanges and their outcomes

### UI/UX Design Patterns
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Built on Radix UI primitives ensuring WCAG compliance
- **Theme System**: Dynamic light/dark mode switching with CSS custom properties
- **Loading States**: Skeleton components and loading indicators for better user experience
- **Form Handling**: React Hook Form integration with Zod validation for robust form management

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern features
- **Express.js**: Backend web application framework
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Build tool and development server

### Database and ORM
- **PostgreSQL**: Primary database (via @neondatabase/serverless for cloud deployment)
- **Drizzle ORM**: Type-safe database toolkit with schema management
- **Drizzle Kit**: Database migration and introspection tools

### Authentication and Security
- **bcrypt**: Password hashing and verification
- **Zod**: Runtime type validation and schema parsing

### UI Component Libraries
- **Radix UI**: Headless, accessible component primitives
- **shadcn/ui**: Pre-styled component library built on Radix
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack React Query**: Server state management with caching
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight routing library

### Development and Build Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

### Utilities
- **clsx & tailwind-merge**: Conditional CSS class management
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **class-variance-authority**: Component variant management