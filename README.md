# School Feeding Management System

This project is a comprehensive web-based system for managing school feeding programs. It is developed as a capstone project under the AUCA Innovation Center.

## Overview
The system provides tools for administrators, government officials, district managers, schools, suppliers, and stock managers to efficiently manage and monitor the distribution and reporting of food supplies in schools.

## Features
- User authentication and role-based access
- Supplier and stock management
- Food request and delivery tracking
- Budgeting and reporting for districts and government
- Administrative dashboards and logs
- Profile management and notifications

## Technologies Used
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Java (Spring Boot)
- **Build Tools:** Maven

## Project Structure
- `frontend/` – React application (UI, pages, components, hooks, utils)
- `SF_Backend/` – Java Spring Boot backend (API, business logic)

## Getting Started
### Prerequisites
- Node.js and npm (for frontend)
- Java 17+ and Maven (for backend)

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Backend Setup
1. Navigate to the `SF_Backend` directory:
   ```sh
   cd SF_Backend
   ```
2. Build and run the Spring Boot application:
   ```sh
   ./mvnw spring-boot:run
   ```

## License
This project is for academic purposes under the AUCA Innovation Center.
