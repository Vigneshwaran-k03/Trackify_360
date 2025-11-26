# Trackify_360

A comprehensive employee performance tracking and management system built with a modern tech stack. Trackify_360 enables organizations to monitor Key Performance Indicators (KPIs), Key Result Areas (KRAs), and manage employee performance through role-based access control.

## 🚀 Features

### Core Functionality
- **Role-Based Access Control**: Admin, Manager, and Employee roles with distinct permissions
- **Performance Management**: Create and track KRAs and KPIs
- **User Management**: Profile creation, authentication, and password management
- **Department Management**: Organize users by departments
- **Review System**: Performance reviews and scoring
- **Request Management**: Handle KPI/KRA modification requests
- **Notifications**: Real-time alerts and email notifications
- **Reporting**: Generate performance reports and logs

### Key Modules
- **Authentication**: JWT-based secure login/logout
- **Dashboard**: Role-specific dashboards with analytics
- **KPI Management**: Create, update, and track Key Performance Indicators
- **KRA Management**: Define and monitor Key Result Areas
- **Scoring System**: Automated performance scoring
- **Mail Service**: Email notifications for various events
- **Maintenance**: System maintenance and health checks

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Scheduling**: @nestjs/schedule for cron jobs
- **Mail Service**: Nodemailer
- **Web Scraping**: Puppeteer
- **Testing**: Jest

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS with DaisyUI
- **Routing**: React Router DOM
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF
- **3D Graphics**: Three.js & OGL

## 📁 Project Structure

```
Trackify_360/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── role/           # Role management
│   │   ├── dept/           # Department management
│   │   ├── kra/            # Key Result Areas
│   │   ├── kpi/            # Key Performance Indicators
│   │   ├── scoring/        # Performance scoring
│   │   ├── review/         # Review system
│   │   ├── maintenance/    # System maintenance
│   │   ├── notification/   # Notification service
│   │   ├── mail/           # Email service
│   │   └── requests/       # Request management
│   ├── test/               # E2E tests
│   └── package.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin-specific pages
│   │   │   ├── manager/    # Manager-specific pages
│   │   │   ├── employee/   # Employee-specific pages
│   │   │   └── common/     # Shared pages
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn package manager

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Trackify_360
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Database Configuration**
   - Create a MySQL database
   - Configure environment variables (see Environment Variables section)

5. **Environment Variables**
   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=trackify_360
   JWT_SECRET=your_jwt_secret
   MAIL_HOST=your_mail_host
   MAIL_PORT=587
   MAIL_USER=your_email
   MAIL_PASS=your_email_app_password
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run start:dev
   ```
   The backend will start on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## 📊 Database Schema

### Core Entities
- **Users**: User accounts with roles and departments
- **Roles**: System roles (Admin, Manager, Employee)
- **Departments**: Organizational departments
- **KRAs**: Key Result Areas with hierarchical structure
- **KPIs**: Key Performance Indicators linked to KRAs
- **KPI Logs**: Time-series KPI data tracking
- **KRA Logs**: Historical KRA modifications
- **Reviews**: Performance reviews and scores
- **Notifications**: System notifications
- **Requests**: KPI/KRA modification requests

## 🔐 Authentication & Authorization

### JWT-Based Authentication
- Secure token-based authentication
- Role-based access control
- Password hashing with bcrypt
- Token expiration management

### User Roles
- **Admin**: Full system access, user management, system configuration
- **Manager**: Department management, KPI/KRA creation, employee supervision
- **Employee**: Personal profile, KPI tracking, request submissions

## 📧 Features Overview

### Dashboard Analytics
- Role-specific dashboard widgets
- Performance metrics visualization
- KPI tracking charts
- Department statistics

### KPI Management
- Create and assign KPIs to employees
- Target vs actual performance tracking
- Historical data visualization
- Automated scoring calculations

### KRA Management
- Hierarchical KRA structure
- Department-wise KRA allocation
- Progress tracking and monitoring
- Change request workflow

### Notification System
- Real-time in-app notifications
- Email notifications for important events
- Slack integration capabilities
- Notification preferences

## 🧪 Testing

### Backend Tests
```bash
cd backend
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
# Run linting
npm run lint
```

## 📦 Build & Deployment

### Backend Production Build
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Production Build
```bash
cd frontend
npm run build
npm run preview
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### Users
- `GET /users` - Get all users (Admin)
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### KPIs
- `GET /kpi` - Get KPIs
- `POST /kpi` - Create KPI
- `PUT /kpi/:id` - Update KPI
- `GET /kpi/logs` - Get KPI logs

### KRAs
- `GET /kra` - Get KRAs
- `POST /kra` - Create KRA
- `PUT /kra/:id` - Update KRA
- `GET /kra/logs` - Get KRA logs

## 🎨 UI/UX Features

### Modern Design
- Responsive design with TailwindCSS
- DaisyUI component library
- Smooth animations with Framer Motion
- Interactive charts and visualizations
- Dark/light theme support

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## 🔄 Scheduled Tasks

### Automated Processes
- Daily KPI score calculations
- Weekly performance reports
- Monthly review reminders
- Database maintenance tasks
- Email notification cleanup

## 📈 Performance Monitoring

### System Metrics
- Application performance monitoring
- Database query optimization
- API response time tracking
- Error logging and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED license - see the LICENSE file for details.

## 📞 Support

For support and queries, please contact the development team or create an issue in the repository.

## 🗺 Roadmap

### Upcoming Features
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Integration with third-party HR systems
- [ ] AI-powered performance insights
- [ ] Multi-tenant support
- [ ] Advanced reporting features

### Version History
- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Enhanced notification system
- **v1.2.0** - Advanced reporting capabilities

---

**Trackify_360** - Transforming performance management with data-driven insights.