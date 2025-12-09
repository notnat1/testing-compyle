# Modern Inventory Management System

A comprehensive inventory management system built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## 🚀 Features

- **Modern Authentication**: Login system with role-based access (Admin/Staff)
- **Professional Dashboard**: Real-time metrics, charts, and analytics
- **Inventory Management**: Complete CRUD operations with search & filtering
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **TypeScript**: Full type safety and IntelliSense support
- **Clean UI/UX**: Modern minimalist design with smooth animations

## 🛠 Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Lucide Icons
- **Charts**: Recharts for data visualization
- **State Management**: React Query + React Context
- **Deployment**: Vercel/Netlify ready

## 📋 Demo Credentials

- **Admin**: admin@demo.com / password123
- **Staff**: staff@demo.com / password123

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── dashboard/         # Dashboard page
│   ├── inventory/         # Inventory management
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── Layout/            # Layout components
│   │   ├── Layout.tsx     # Main layout wrapper
│   │   ├── Header.tsx     # Top navigation
│   │   └── Sidebar.tsx    # Collapsible sidebar
│   ├── Dashboard/         # Dashboard components
│   │   ├── StatsCards.tsx # Metric cards
│   │   ├── InventoryChart.tsx # Trends chart
│   │   ├── CategoryChart.tsx # Pie chart
│   │   └── RecentActivity.tsx # Activity timeline
│   └── ui/               # Shared UI components
│       ├── Button.tsx     # Reusable button
│       ├── Modal.tsx      # Modal dialog
│       ├── Card.tsx       # Content card
│       ├── Badge.tsx      # Status badges
│       ├── Table.tsx      # Sortable table
│       └── Toast.tsx      # Notifications
├── lib/
│   └── utils.ts          # Utility functions
├── types/
│   └── index.ts          # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd inventory-management-system
```

2. Install dependencies
```bash
npm install
npm install clsx tailwind-merge lucide-react recharts @tanstack/react-query
```

3. Run development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Features Overview

### Dashboard
- Real-time inventory metrics
- Interactive charts showing trends
- Category distribution visualization
- Recent transaction timeline
- Responsive grid layout

### Inventory Management
- Advanced search and filtering
- Sortable data tables
- Stock status indicators
- Category-based organization
- Mobile-friendly interface

### Authentication
- Secure login system
- Role-based access control
- Protected routes
- Session management

### UI Components
- Modern button variants
- Modal dialogs
- Status badges
- Loading states
- Toast notifications

## 🎨 Design System

### Color Palette
- Primary: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Yellow)
- Error: #EF4444 (Red)
- Background: #F9FAFB (Light gray)

### Typography
- Font: Geist Sans
- Clean, modern hierarchy
- Consistent spacing

## 📱 Mobile Responsive

- Mobile-first design approach
- Touch-friendly interactions
- Collapsible sidebar on small screens
- Optimized table layouts

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Database Setup

This is currently using mock data. To connect to a real database:

1. Set up your preferred database (PostgreSQL, MongoDB, etc.)
2. Update the API routes to connect to your database
3. Add proper authentication with NextAuth.js or similar

## 📝 API Routes

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Create inventory item

## 🧪 Testing

```bash
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
npm run lint        # Check code quality
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push to main branch

### Manual Build

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Roadmap

- [ ] Real database integration
- [ ] Advanced reporting features
- [ ] Barcode scanning
- [ ] Mobile app version
- [ ] Multi-warehouse support
- [ ] Advanced analytics
- [ ] API documentation

## 📞 Support

If you have any questions or need help, feel free to open an issue in the repository.

---

Built with ❤️ using Next.js 16, React 19, and TypeScript
