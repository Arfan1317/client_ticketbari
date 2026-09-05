# TicketBari — Online Ticket Booking Platform

**TicketBari** is a full-stack online ticket booking platform built with the MERN stack where users can discover and book travel tickets for Bus, Train, Launch, and Plane. The platform supports three user roles: **User**, **Vendor**, and **Admin**.

## 🔗 Live URL

- **Client**: [https://ticketbari.web.app](https://ticketbari.web.app)
- **Server**: [https://ticketbari-server.vercel.app](https://ticketbari-server.vercel.app)

## 🔑 Demo Credentials

| Role   | Email                   | Password    |
|--------|-------------------------|-------------|
| Admin  | admin@ticketbari.com    | Admin@123   |
| Vendor | vendor@ticketbari.com   | Vendor@123  |

## ✨ Key Features

### For Users
- Browse and search travel tickets by location, transport type, and price
- Book tickets with real-time availability tracking
- Secure payments through Stripe
- View booking history and transaction records
- Download PDF ticket receipts
- Cancel bookings before vendor acceptance

### For Vendors
- Add and manage travel tickets with image upload (ImgBB)
- View and manage incoming booking requests (accept/reject)
- Track revenue with interactive charts and statistics
- Update ticket details and manage inventory

### For Admins
- Approve or reject vendor-submitted tickets
- Manage user roles (promote to Admin/Vendor)
- Mark fraudulent vendors (hides their tickets)
- Control homepage advertisement slots (up to 6 featured tickets)

### General Features
- BetterAuth authentication (Email/Password + Google OAuth)
- JWT-protected API routes with role-based access
- Dark/Light theme toggle
- Fully responsive design (Mobile, Tablet, Desktop)
- Server-side search, filter, sort & pagination
- Real-time countdown timer for departures
- Loading states and error handling throughout

## 🛠 Technology Stack

### Frontend
| Package | Purpose |
|---------|---------|
| React 18 | UI library |
| Vite | Build tool |
| React Router DOM | Client-side routing |
| TanStack React Query | Server state management |
| Axios | HTTP client |
| Tailwind CSS | Utility-first CSS |
| DaisyUI | UI component library |
| better-auth | Auth client |
| react-hook-form | Form management |
| @stripe/react-stripe-js | Stripe payment UI |
| swiper | Homepage carousel |
| recharts | Dashboard charts |
| react-icons | Icon library |
| react-hot-toast | Toast notifications |
| sweetalert2 | Confirmation dialogs |
| jspdf | PDF generation |
| date-fns | Date formatting |

### Backend
| Package | Purpose |
|---------|---------|
| Express.js | Web framework |
| Mongoose | MongoDB ODM |
| better-auth | Authentication |
| mongodb | MongoDB driver (for BetterAuth adapter) |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| jsonwebtoken | JWT generation/verification |
| stripe | Payment processing |
| bcrypt | Password hashing |

## 📁 Project Structure

```
ticketbari/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level pages
│   │   ├── providers/    # Context providers
│   │   ├── routes/       # Route protection
│   │   └── lib/          # Utilities & config
│   └── ...
├── server/           # Express.js backend
│   ├── src/
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   └── lib/          # BetterAuth config
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud OAuth credentials
- Stripe account (test mode)
- ImgBB API key

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
4. Create `.env` files in both `server/` and `client/` directories (see `.env.example`)
5. Start the server:
   ```bash
   cd server
   npm run dev
   ```
6. Start the client:
   ```bash
   cd client
   npm run dev
   ```

## 📄 License

This project is for educational purposes.
