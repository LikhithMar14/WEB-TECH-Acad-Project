# True Colors - College Laundry Service

True Colors is a modern web application for managing college laundry services, built with Next.js and Prisma.

## Features

- **Authentication**: Google Sign-In (restricted to college email domains)
- **User Dashboard**: Track orders, remaining washes, and subscription status
- **Admin Dashboard**: Manage users, orders, and laundry operations
- **Order Management**: Create, track, and update laundry orders
- **Subscription System**: Choose between different subscription plans
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Components**: Radix UI components with shadcn/ui
- **State Management**: React Hooks
- **Authentication**: NextAuth.js 4
- **Database**: PostgreSQL with Prisma ORM
- **UI Animation**: Framer Motion
- **Icons**: Lucide React

## Project Structure

- `/src/app`: Main application pages and routing
- `/src/components`: Reusable React components
- `/src/actions`: Server actions for data operations
- `/src/db`: Database configuration and seed scripts
- `/src/lib`: Utility functions and shared logic
- `/src/providers`: Context providers for the application
- `/prisma`: Prisma schema and migrations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google OAuth credentials

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/truecolors"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google Provider
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Seed the database:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

6. Access the application at http://localhost:3000

## Usage

### User Flow

1. **Sign In**: Login with your college Google account
2. **Dashboard**: View your laundry history, remaining washes, and subscription status
3. **Create Order**: Select items for laundry, specify weights, and choose a laundry location
4. **Track Order**: Monitor the status of your orders on the dashboard
5. **Subscribe**: Opt for a subscription plan for unlimited washes

### Admin Flow

1. **Sign In**: Login with an admin account (predefined in the system)
2. **Admin Dashboard**: Access comprehensive overview of all users and orders
3. **Manage Orders**: Update order status and track service operations
4. **User Management**: Add washes for users and manage their accounts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/true-colors](https://github.com/yourusername/true-colors)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [shadcn/ui](https://ui.shadcn.com/)
