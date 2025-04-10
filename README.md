
# 🎬 GSG Cinema

A modern, responsive cinema management system built with Next.js, TypeScript, and Tailwind CSS.

![GSG Cinema](https://img.shields.io/badge/Next.js-13.4.0-black?style=for-the-badge&logo=next.js)  
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-336791?style=for-the-badge&logo=postgresql)

## 🎥 Demo

[![Watch the Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

## ✨ Features

- 🎥 Movie browsing and showtime management
- 🎟️ Online ticket booking system
- 👤 User authentication and role-based access
- 🎭 Multiple user roles (Admin, Staff, User)
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🔒 Secure authentication system
- ⚡ Fast and optimized performance
- 🗄️ PostgreSQL database for reliable data storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager
- PostgreSQL 16.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lh-rubz/GSG_Cinema.git
cd GSG_Cinema
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up PostgreSQL:
   - Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
   - Create a new database:
   ```sql
   CREATE DATABASE gsg_cinema;
   ```
   - Create a new user (optional):
   ```sql
   CREATE USER gsg_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE gsg_cinema TO gsg_user;
   ```

4. Create a `.env.local` file in the root directory and add your environment variables:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/gsg_cinema"

# Next.js Configuration
NEXT_PUBLIC_API_URL=your_api_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Add other environment variables as needed
```

5. Run database migrations and seed the database:
```bash
# Run migrations
npm run migrate
# or
yarn migrate

# Seed the database with initial data (in correct order)
npm run seed
# or
yarn seed
```

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
gsg-cinema/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   ├── (staff)/           # Staff routes
│   ├── api/               # API routes
│   ├── profile/           # User profile
│   └── ...                # Other pages
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
│   ├── migrations/        # Database migrations
│   ├── seed.ts           # Database seeding script
│   └── schema.prisma     # Prisma schema
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## 🗄️ Database Setup

### Prisma Configuration

The project uses Prisma as the ORM. The database schema is defined in `prisma/schema.prisma`. To make changes to the database schema:

1. Modify the schema file
2. Generate a new migration:
```bash
npx prisma migrate dev --name your_migration_name
```

### Database Seeding Order

The seeding process must follow this specific order due to foreign key constraints. Run these commands in sequence:

```bash
# 1. Seed Directors
npx ts-node scripts/seeds/directorSeed.ts

# 2. Seed Cast Members
npx ts-node scripts/seeds/castMemberSeed.ts

# 3. Seed Movies
npx ts-node scripts/seeds/movieSeed.ts

# 4. Seed Users
npx ts-node scripts/seeds/userSeed.ts

# 5. Seed Screens
npx ts-node scripts/seeds/screenSeed.ts

# 6. Seed Showtimes
npx ts-node scripts/seeds/showtimeSeed.ts

# 7. Seed Tickets
npx ts-node scripts/seeds/ticketSeed.ts

# 8. Seed Receipts
npx ts-node scripts/seeds/recipts.ts

# 9. Seed Reviews
npx ts-node scripts/seeds/reviewSeed.ts

# 10. Seed Review Replies
npx ts-node scripts/seeds/replySeed.ts

# 11. Seed Review Likes
npx ts-node scripts/seeds/likeSeed.ts
```

Or use the combined seed script:
```bash
npm run seed
# or
yarn seed
```

### Database Management

Common database operations:

```bash
# Generate Prisma Client
npx prisma generate

# Reset the database (warning: this will delete all data)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```


## 👥 Team

### TSXperts

- **Heba Abu el-rub**  
[![Heba's Profile](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/157056608?v=4&h=150&w=150&fit=cover&mask=circle&maxage=7d)](https://github.com/lh-rubz)  
- **Lama Hafiz**  
[![Lama's Profile](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/196972268?v=4&h=150&w=150&fit=cover&mask=circle&maxage=7d)](https://github.com/lamahafez)  
- **Mohammed Jaber**  
[![Mohammed Jaber's Profile](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/104308147?v=4&h=150&w=150&fit=cover&mask=circle&maxage=7d)](https://github.com/Mohamad-jaber)  
- **Mohammed Dhedy**  
[![Mohammed Dhedy's Profile](https://images.weserv.nl/?url=avatars.githubusercontent.com/u/113359049?v=4&h=150&w=150&fit=cover&mask=circle&maxage=7d)](http://github.com/mohammad2004dhedy)  



## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database with initial data
- `npm run db:studio` - Open Prisma Studio for database management

### Code Style

- Follow the [Next.js](https://nextjs.org/docs) documentation
- Use TypeScript for type safety
- Follow the [Tailwind CSS](https://tailwindcss.com/docs) best practices
- Use functional components with hooks
- Follow the [ESLint](https://eslint.org/) rules defined in the project

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [PostgreSQL](https://www.postgresql.org/) - Powerful open-source database
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
- [React Icons](https://react-icons.github.io/react-icons/) - Popular icons pack

## ⭐ Don’t We Deserve a Star? 😏

We’ve been coding all night, and we only ask for one thing...  
A star ⭐. It’s not that hard, we promise! 😜

![Funny GIF](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmx2ajBsN2RxeWQ1MWUzdHZnaHVnNTlpMHNzd2JpcGMyZmM2bXJqZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/I1nwVpCaB4k36/giphy.gif)

---

Made with ❤️ by TSXperts Team

---
