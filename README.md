# Health & Fitness Planner

> A comprehensive digital platform for fitness tracking, workout management, and health monitoring - built for trainers, trainees, and fitness enthusiasts.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00?logo=sqlalchemy)](https://www.sqlalchemy.org/)

## 🎯 Vision

We're building a **modern, intelligent fitness management platform** that connects trainers with trainees, streamlines workout programming, and provides actionable health insights. Our goal is to make professional fitness coaching accessible, data-driven, and seamlessly integrated into daily routines.

---

## 📋 Table of Contents

- [What We're Building](#-what-were-building)
- [Market & Target Audience](#-market--target-audience)
- [Market Gap & Differentiation](#-market-gap--differentiation)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Implementation Plan](#-implementation-plan)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Roadmap](#-development-roadmap)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Documentation](#-documentation)

---

## 🚀 What We're Building

### The Problem
- **Trainers** struggle with managing multiple clients, tracking progress, and creating personalized programs
- **Trainees** lack structured guidance, progress visibility, and accountability
- **Gym Owners** need tools to manage staff, equipment, and member engagement
- Existing solutions are either too complex, expensive, or lack integration

### Our Solution
A **three-tier platform** that serves:

1. **Trainers** - Tools for client management, program design, and progress monitoring
2. **Trainees** - Personalized workout plans, health tracking, and performance analytics
3. **Gym Admins** - Centralized management of trainers, members, and gym operations

### Core Capabilities
- 🏋️ **Workout Management** - Create, assign, and track customized workout programs
- 📊 **Health Metrics** - Monitor weight, body composition, and fitness goals
- 📈 **Progress Analytics** - Visualize trends, PR tracking, and volume calculations
- 👥 **Multi-Role System** - Role-based access for admins, trainers, and trainees
- 🔒 **Enterprise Security** - JWT authentication, rate limiting, input validation
- 📱 **Responsive Design** - Modern UI that works on desktop, tablet, and mobile

---

## 🧭 Market & Target Audience

### Target Segments
- Independent personal trainers building and managing client rosters (solo or small teams)
- Boutique/medium-sized gyms that need lightweight member, trainer, and program management
- Corporate wellness programs seeking structured fitness tracking for employees
- Fitness enthusiasts who want structured programming and progress analytics without a trainer

### Personas
- Trainer Taylor: manages 15–50 clients, needs fast program templates, progress snapshots, and adherence tracking
- Trainee Ari: wants clear, personalized plans with simple logging and visible progress
- Gym Admin Alex: coordinates trainers, oversees programs, and needs auditability and basic analytics

---

## 🧩 Market Gap & Differentiation

### The Gap Today
- Fragmented toolchain: spreadsheets, messaging apps, and siloed trackers that don’t talk to each other
- Enterprise suites are expensive and overbuilt for small teams; consumer apps are underpowered for coaching
- Poor data portability and limited analytics; progress is hard to quantify and share
- Security and compliance often treated as afterthoughts in smaller products

### Our Differentiators
- Coach-first workflow: fast program creation, reusable templates, and real-time progress views
- Clear roles and permissions (Admin / Trainer / Trainee) with secure audit trails
- Opinionated, safe-by-default backend (validation, rate limiting, RBAC) ready for scale
- Open, well-documented API enabling internal tools and future integrations (wearables, CRM)

---

## ✨ Key Features

### For Trainees
- ✅ Track workouts with sets, reps, weight, and rest periods
- ✅ Log health metrics (weight, height, body fat, BMI)
- ✅ View assigned workout programs from trainers
- ✅ Monitor progress over time with visual analytics
- ✅ Access exercise library with video demonstrations

### For Trainers
- ✅ Manage multiple trainee profiles
- ✅ Design custom workout programs
- ✅ Assign exercises with prescribed sets/reps/weight
- ✅ Monitor trainee progress and adherence
- ✅ Create and share exercise templates

### For Admins
- ✅ Manage gym locations and facilities
- ✅ Oversee trainer and trainee accounts
- ✅ Access system-wide analytics
- ✅ Configure gym-specific settings

### Platform Features
- 🔐 **Secure Authentication** - JWT tokens with OAuth2 compliance
- 🛡️ **Input Validation** - SQL injection and XSS protection
- ⚡ **Rate Limiting** - API abuse prevention (5/min login, 10/min write operations)
- 📝 **Comprehensive Logging** - Audit trails for all operations
- 🧪 **Full Test Coverage** - 76/76 tests passing (unit + integration)

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.104.1 (Python 3.11+)
- **Database**: SQLAlchemy 2.0 ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication**: JWT tokens with python-jose, OAuth2 password flow
- **Validation**: Pydantic v2 with custom validators
- **Rate Limiting**: slowapi (Redis-ready)
- **Password Hashing**: passlib with pbkdf2-sha256
- **Testing**: pytest with 76 comprehensive tests

### Frontend
- **Framework**: React 18.2.0 with React Router v6
- **UI Library**: Material-UI (MUI) v5
- **HTTP Client**: Axios with request/response interceptors
- **State Management**: React Context API + hooks
- **Styling**: CSS modules + MUI theming
- **Form Handling**: Controlled components with validation

### DevOps & Tools
- **Version Control**: Git + GitHub
- **API Testing**: pytest, Postman
- **Code Quality**: Pylance, ESLint
- **Development Server**: Uvicorn (backend), React Dev Server (frontend)
- **Documentation**: Markdown, OpenAPI/Swagger

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │   Landing    │  │    Auth      │  │     Dashboard       │   │
│  │     Page     │  │   (Login/    │  │  (Trainees/         │   │
│  │              │  │   Register)  │  │   Trainers)         │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/REST API
                             │ JWT Bearer Token
┌────────────────────────────▼────────────────────────────────────┐
│                      Backend (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Layer (v1)                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────────┐ │   │
│  │  │   Auth     │  │  Trainees  │  │    Trainers       │ │   │
│  │  │ Endpoints  │  │ Endpoints  │  │   Endpoints       │ │   │
│  │  └────────────┘  └────────────┘  └───────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Middleware Layer                        │   │
│  │  • Rate Limiting  • Auth Guards  • CORS  • Logging      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Business Logic                         │   │
│  │  ┌────────┐  ┌───────────┐  ┌────────────┐             │   │
│  │  │  CRUD  │  │  Schemas  │  │ Validation │             │   │
│  │  │ Layer  │  │ (Pydantic)│  │   Logic    │             │   │
│  │  └────────┘  └───────────┘  └────────────┘             │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Data Access Layer                      │   │
│  │  • SQLAlchemy Models  • Database Session Management     │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Database (SQLAlchemy)                         │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │  Users  │  │ Gyms    │  │ Programs │  │  Exercise Logs  │   │
│  │ (Auth)  │  │         │  │          │  │                 │   │
│  └─────────┘  └─────────┘  └──────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema (ERD)

See [docs/architecture/ERD.md](docs/architecture/ERD.md) for the complete entity-relationship diagram.

**Core Models**:
- `Trainee` - User profiles for fitness enthusiasts
- `Trainer` - Certified fitness professionals
- `Gym` - Physical locations and facilities
- `Exercise` - Exercise library with video links
- `Program` - Workout programs designed by trainers
- `ProgramExercise` - Prescribed exercises within programs
- `WorkoutSession` - Individual workout instances
- `ExerciseLog` - Sets/reps/weight tracking per exercise
- `HealthMetric` - Body measurements and metrics over time

---

## 🚀 Getting Started
 
## 🧪 Implementation Plan

This section outlines how we plan to build, scale, and maintain the platform so new developers can onboard quickly.

### Backend (FastAPI + SQLAlchemy)
- Domain-driven structure: `api/`, `auth/`, `core/`, `crud/`, `db/`, `models/`, `schemas/`
- Authentication: OAuth2 password flow + JWT (access tokens), password hashing via passlib (pbkdf2-sha256)
- Authorization: Role-Based Access Control (Admin, Trainer, Trainee) enforced at endpoint and service layers
- Validation & Security: Pydantic v2 validators, centralized sanitization (SQLi/XSS), rate limiting via slowapi
- Data Access: SQLAlchemy ORM models with typed Pydantic schemas; repository-style CRUD in `crud/`
- API Versioning: `api/v1` with plan to introduce `v2` behind feature flags and compatibility endpoints

### Frontend (React + MUI)
- Routing: React Router v6 with protected routes and role-aware navigation
- State: Lightweight Context + hooks; token handling via Axios interceptors
- UI: MUI components with theme tokens; responsive design for mobile/desktop
- Features: Auth flow, dashboards (trainee/trainer), program builder, exercise library with video links

### Data & Database
- Dev: SQLite for local development and tests; Prod: PostgreSQL with migration path
- Modeling: 9 core entities (Trainee, Trainer, Gym, Exercise, Program, ProgramExercise, WorkoutSession, ExerciseLog, HealthMetric)
- Indexing: Add pragmatic indexes for lookups (e.g., user email, foreign keys on logs/sessions)
- Performance: Use selectin/joinedload patterns to avoid N+1 queries; caching layer (Redis) for hot reads later

### Security & Compliance
- Implemented: Strong password policy, JWT, rate limiting, input sanitization, CORS, audit-friendly logging
- Planned: Secrets management via environment variables, HTTP security headers, request IDs, and privacy review

### DevOps & Quality
- Local: Uvicorn with reload, React dev server; pytest suite (unit+integration)
- CI-ready: Linting, typing, and tests to gate PRs (to be wired)
- Observability: Structured logs, later metrics/tracing hooks

### Milestones & Timeline (Rolling)
1. Foundation (done): Auth, CRUD, schemas, tests, initial UI
2. Security hardening (done): RBAC, validation, rate limiting
3. Performance pass (current): indexing, eager loading, basic caching
4. Observability: structured logging, request IDs, error tracking
5. Integrations: wearable APIs, import/export, payment later

### Success Criteria & KPIs
- Time-to-onboard a new trainer < 10 minutes (from signup to assigning first program)
- Trainee weekly adherence > 70% for active programs
- P95 API latency < 200ms for common reads; < 500ms for writes
- < 0.1% auth-related errors per 1k requests with rate limiting in place

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/vihaankulkarni29/health-and-fitness-planner.git
cd health-and-fitness-planner
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (creates tables)
python -c "from app.db.session import engine; from app.db.base import Base; Base.metadata.create_all(bind=engine)"

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**
API docs (Swagger): **http://localhost:8000/docs**

#### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will be available at: **http://localhost:3000**

#### 4. Create Test User
```bash
# In backend directory
python create_test_user.py
```

**Demo Credentials**:
- Email: `test@example.com`
- Password: `test1234`
- Role: Trainee

### Quick Test
1. Open http://localhost:3000
2. Click "Login" 
3. Enter test credentials
4. Explore the dashboard!

---

## 📁 Project Structure

```
health-and-fitness-planner/
│
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── api/                  # API endpoints
│   │   │   └── v1/
│   │   │       └── endpoints/    # Trainee, Trainer, Health Metrics, etc.
│   │   ├── auth/                 # Authentication logic
│   │   ├── core/                 # Core configuration
│   │   │   ├── config.py         # App settings
│   │   │   ├── validation.py     # Input validation & sanitization
│   │   │   └── rate_limit.py     # Rate limiting config
│   │   ├── crud/                 # Database operations (Create, Read, Update, Delete)
│   │   ├── db/                   # Database setup
│   │   │   ├── base.py           # Import all models for migrations
│   │   │   ├── base_class.py     # SQLAlchemy base model
│   │   │   └── session.py        # Database session management
│   │   ├── models/               # SQLAlchemy ORM models
│   │   │   ├── trainee.py
│   │   │   ├── trainer.py
│   │   │   ├── exercise.py
│   │   │   ├── program.py
│   │   │   ├── health_metric.py
│   │   │   └── ...
│   │   ├── schemas/              # Pydantic validation schemas
│   │   │   ├── trainee.py
│   │   │   ├── trainer.py
│   │   │   └── ...
│   │   └── main.py               # FastAPI app initialization
│   ├── tests/                    # Backend tests (76 tests)
│   ├── create_test_user.py       # Test user creation script
│   ├── debug_login.py            # Login debugging utility
│   └── requirements.txt          # Python dependencies
│
├── frontend/                     # React Frontend
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/                  # API client (axios)
│   │   │   ├── client.js         # Base axios instance
│   │   │   ├── auth.js           # Authentication API
│   │   │   └── ...
│   │   ├── components/           # Reusable React components
│   │   │   ├── Layout/           # App layout, navbar, footer
│   │   │   ├── Auth/             # Login, register forms
│   │   │   └── ...
│   │   ├── pages/                # Page components
│   │   │   ├── LandingPage.js    # Homepage
│   │   │   ├── TraineeDashboard.js
│   │   │   └── ...
│   │   ├── utils/                # Helper functions
│   │   ├── App.js                # Main app component
│   │   └── index.js              # React entry point
│   ├── package.json              # NPM dependencies
│   └── README.md                 # Frontend-specific docs
│
├── docs/                         # Documentation (ORGANIZED!)
│   ├── architecture/             # System architecture & design
│   │   ├── ARCHITECTURE.md       # Overall system design
│   │   ├── ERD.md                # Database schema & relationships
│   │   └── BACKEND_DEVELOPMENT_PLAN.md
│   ├── phases/                   # Development phase logs
│   │   ├── PHASE_1_LOG.md        # Initial setup
│   │   ├── PHASE_2_LOG.md        # Authentication
│   │   ├── PHASE_3_LOG.md        # Core features
│   │   ├── PHASE_4_LOG.md        # Testing
│   │   ├── PHASE_5_LOG.md        # Frontend integration
│   │   ├── PHASE_6_LOG.md        # RBAC implementation
│   │   └── PHASE_7_LOG.md        # Security hardening
│   ├── ui/                       # UI/UX documentation
│   │   ├── UI_UX_DEVELOPMENT_PLAN.md
│   │   ├── UI_UX_PROGRESS.md
│   │   └── LANDING_PAGE_FEATURES.md
│   ├── guides/                   # User & developer guides
│   │   ├── DEMO_GUIDE.md         # Application demo walkthrough
│   │   ├── INVESTOR_DEMO_GUIDE.md
│   │   ├── QUICK_REFERENCE.md    # API quick reference
│   │   └── RATE_LIMITING.md      # Rate limiting documentation
│   ├── logs/                     # Error logs & major changes
│   │   ├── ERROR_LOG.md          # Known issues & resolutions
│   │   └── MAJOR_WORK.md         # Major milestones
│   └── README.md                 # Docs index
│
├── prompts/                      # AI assistant prompts & templates
├── DEMO_GUIDE.md                 # Quick demo instructions (root)
├── LOGIN_CREDENTIALS.md          # Demo login credentials
├── .gitignore                    # Git ignore patterns
└── README.md                     # THIS FILE - Project overview
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1-3: Foundation (COMPLETE)
- [x] Database schema design (9 models)
- [x] SQLAlchemy ORM setup
- [x] Pydantic validation schemas
- [x] Basic CRUD operations
- [x] JWT authentication
- [x] FastAPI endpoints (REST API)

### ✅ Phase 4-5: Testing & Frontend (COMPLETE)
- [x] Comprehensive test suite (76/76 tests passing)
- [x] React frontend with Material-UI
- [x] Landing page with feature showcase
- [x] Authentication flow (login/register)
- [x] Trainee & Trainer dashboards

### ✅ Phase 6-7: Security & RBAC (COMPLETE)
- [x] Role-based access control (Admin/Trainer/Trainee)
- [x] Input validation & sanitization (SQL injection, XSS prevention)
- [x] Rate limiting (slowapi with Redis support)
- [x] Password complexity requirements
- [x] Security audit & documentation

### 🔄 Phase 8: Current Sprint
- [ ] Database optimization (indexes, query optimization)
- [ ] Caching layer (Redis for exercise library)
- [ ] Logging & monitoring (structured logs, request IDs)
- [ ] Secrets management (.env configuration)
- [ ] API versioning strategy

### 🔮 Phase 9+: Future Enhancements
- [ ] Real-time notifications (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (ML-powered insights)
- [ ] Social features (trainer marketplace, community)
- [ ] Integration with wearables (Fitbit, Apple Health)
- [ ] Multi-gym support for enterprise

See [docs/architecture/BACKEND_DEVELOPMENT_PLAN.md](docs/architecture/BACKEND_DEVELOPMENT_PLAN.md) for detailed roadmap.

---

## 📚 API Documentation

### Interactive API Docs
- **Swagger UI**: http://localhost:8000/docs (interactive testing)
- **ReDoc**: http://localhost:8000/redoc (clean documentation)

### Authentication
All endpoints (except `/auth/login` and `/auth/register`) require JWT authentication:

```bash
# Login to get token
curl -X POST "http://localhost:8000/api/v1/auth/login/access-token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test1234"

# Use token in subsequent requests
curl -X GET "http://localhost:8000/api/v1/trainees/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new trainee
- `POST /api/v1/auth/login/access-token` - Login (get JWT token)
- `POST /api/v1/auth/test-token` - Verify token validity

#### Trainees
- `GET /api/v1/trainees/me` - Get current trainee profile
- `PUT /api/v1/trainees/me` - Update trainee profile
- `GET /api/v1/trainees/{id}` - Get trainee by ID (trainers only)

#### Health Metrics
- `POST /api/v1/health-metrics/` - Log new health metric
- `GET /api/v1/health-metrics/me` - Get my health history
- `GET /api/v1/health-metrics/latest` - Get latest metric

#### Programs & Workouts
- `GET /api/v1/programs/` - List all programs
- `GET /api/v1/programs/{id}` - Get program details
- `POST /api/v1/workout-sessions/` - Start new workout
- `POST /api/v1/exercise-logs/` - Log exercise set

See [docs/guides/QUICK_REFERENCE.md](docs/guides/QUICK_REFERENCE.md) for complete API reference.

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

**Test Coverage**: 76/76 tests passing
- Authentication & Authorization
- CRUD operations (all models)
- Input validation (SQL injection, XSS)
- Rate limiting
- Error handling

### Frontend Testing (Coming Soon)
- React Testing Library
- Jest unit tests
- Cypress E2E tests

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint rules for JavaScript
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

---

## 📖 Documentation

### For Developers
- **[Architecture Guide](docs/architecture/ARCHITECTURE.md)** - System design principles
- **[ERD Diagram](docs/architecture/ERD.md)** - Database relationships
- **[Phase Logs](docs/phases/)** - Detailed development history
- **[Rate Limiting](docs/guides/RATE_LIMITING.md)** - API protection strategy

### For Users
- **[Demo Guide](docs/guides/DEMO_GUIDE.md)** - How to demonstrate the app
- **[Login Credentials](LOGIN_CREDENTIALS.md)** - Test user details
- **[Quick Reference](docs/guides/QUICK_REFERENCE.md)** - API cheat sheet

### For Investors
- **[Investor Demo](docs/guides/INVESTOR_DEMO_GUIDE.md)** - Pitch deck walkthrough
- **[UI/UX Progress](docs/ui/UI_UX_PROGRESS.md)** - Design evolution

---

## 🔒 Security

### Implemented Protections
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - pbkdf2-sha256 with salt
- ✅ **SQL Injection Prevention** - Parameterized queries + validation
- ✅ **XSS Protection** - Input sanitization
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **CORS Configuration** - Controlled cross-origin requests
- ✅ **Input Validation** - Pydantic schema enforcement

### Reporting Vulnerabilities
Please email security issues to: vihaankulkarni29@gmail.com

---

## 📄 License

This project is currently **proprietary**. All rights reserved.

For licensing inquiries, contact: vihaankulkarni29@gmail.com

---

## 👥 Team

- **Vihaan Kulkarni** - Full-Stack Developer & Project Lead
- GitHub: [@vihaankulkarni29](https://github.com/vihaankulkarni29)

---

## 🙏 Acknowledgments

- FastAPI framework for excellent async Python web development
- React & Material-UI for modern frontend capabilities
- SQLAlchemy for robust ORM functionality
- The open-source community for inspiration and tools

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/vihaankulkarni29/health-and-fitness-planner/issues)
- **Email**: vihaankulkarni29@gmail.com
- **Demo**: Available upon request for investors/partners

---

**Built with ❤️ for the fitness community**

*Last Updated: November 7, 2025*
