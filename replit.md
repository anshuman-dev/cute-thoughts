# Overview

This is a full-stack web3 application called "Cute Thoughts" built on the Base blockchain. The app allows users to generate and share positive, uplifting thoughts while optionally tipping ETH. It features a React frontend with Web3 wallet integration and an Express.js backend with PostgreSQL database storage.

The application combines blockchain interaction through smart contracts with traditional web development patterns, creating a social platform for spreading positivity with crypto incentives.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Web3 Integration**: Wagmi for Ethereum wallet connections and contract interactions
- **Styling**: Tailwind CSS with custom CSS variables for theming, including cute-themed color palette

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Development Setup**: Hot reloading with tsx for development, esbuild for production builds
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development/testing
- **Connection**: Neon Database as the PostgreSQL provider

## Database Schema
- **Thoughts Table**: Stores user-generated thoughts with user addresses, content, transaction hashes, tip amounts, and timestamps
- **Social Shares Table**: Tracks sharing activity across platforms (Twitter, Farcaster, Instagram) with relationship to thoughts

## Authentication and Authorization
- **Web3 Wallet Authentication**: Users connect through MetaMask or WalletConnect
- **Address-based Identity**: User identification through Ethereum wallet addresses
- **No Traditional Auth**: No username/password system - purely wallet-based authentication

# External Dependencies

## Blockchain Infrastructure
- **Base Network**: Ethereum L2 network for smart contract deployment
- **Smart Contract**: CuteThoughtsGenerator contract for thought generation and tipping functionality
- **Wagmi**: Web3 React hooks for wallet connection and contract interaction
- **Viem**: Low-level Ethereum client for transaction handling

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with schema validation using Zod

## UI and Styling
- **Radix UI**: Unstyled, accessible component primitives
- **Shadcn/ui**: Pre-built component library with consistent design system
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Replit Integration**: Vite plugins for Replit development environment
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Social Sharing
- **Twitter**: Direct sharing integration through Twitter Web Intents
- **Farcaster**: Warpcast composer integration for decentralized social sharing
- **Instagram**: Clipboard-based sharing for Instagram Stories