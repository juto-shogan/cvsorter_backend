# OGTL CV Management System - Backend

## Project Overview

This is the backend component of the OGTL CV Management System, a robust and scalable API built with Node.js and Express. It serves as the data and business logic layer for the frontend application, handling user authentication, CV uploads, data storage, and retrieval, as well as providing insights into the CV database.

## Project Objective

The primary objective of the backend is to provide a secure, efficient, and reliable set of API endpoints that enable the frontend application to manage candidate CVs. It focuses on handling file uploads, parsing/storing CV metadata, authenticating users, and serving data for the dashboard and review processes, ensuring data integrity and application security.

## Technologies Used

The backend is built with a modern JavaScript stack, leveraging powerful tools and libraries:

* **Node.js:** The JavaScript runtime environment.
* **Express.js:** A fast, unopinionated, minimalist web framework for building the RESTful API.
* **MongoDB:** A flexible NoSQL document database used for storing CV metadata and user information.
* **Mongoose:** An elegant MongoDB object modeling tool for Node.js, simplifying interactions with the database.
* **JWT (jsonwebtoken):** JSON Web Tokens for secure, stateless user authentication.
* **Bcrypt:** A library for hashing passwords securely.
* **Multer:** A middleware for handling `multipart/form-data`, primarily used for uploading files.
* **Dotenv:** For loading environment variables from a `.env` file.
* **Nodemon:** A utility that monitors for changes in your source and automatically restarts your server (for development).
* **CORS:** Middleware to enable Cross-Origin Resource Sharing.

## Project Structure

The backend follows a modular and organized structure to enhance maintainability and scalability:

```

backend/

├── config/              # Configuration files (e.g., database connection, environment variables)

│   └── db.js            # MongoDB connection setup

├── controllers/         # Business logic for handling requests and interacting with models

│   ├── authController.js

│   ├── cvController.js

│   └── userController.js

├── middleware/          # Express middleware functions (e.g., authentication, error handling)

│   ├── authMiddleware.js

│   └── errorHandler.js

├── models/              # Mongoose schemas and models for database entities

│   ├── CV.js

│   └── User.js

├── routes/              # Defines API routes and links them to controller functions

│   ├── authRoutes.js

│   ├── cvRoutes.js

│   └── userRoutes.js

├── uploads/             # Directory where uploaded CV files are stored

├── server.js            # Main application entry point

├── package.json         # Project metadata and dependencies

├── .env.example         # Example environment variables

└── README.md            # This file

```

## Setup and Installation

Follow these steps to set up and run the backend locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ogtl-cv-management-system/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env` file:**
    Create a file named `.env` in the `backend/` directory and add the following environment variables. Replace the placeholder values with your actual credentials.
    ```env
    MONGO_URI=your_mongodb_connection_string # e.g., mongodb+srv://user:pass@cluster.mongodb.net/cvdb?retryWrites=true&w=majority
    JWT_SECRET=a_very_secret_jwt_key
    PORT=5000
    UPLOAD_DESTINATION=uploads # Directory for storing uploaded CVs (e.g., 'uploads')
    ```
    * **`MONGO_URI`**: Your MongoDB connection string (e.g., from MongoDB Atlas).
    * **`JWT_SECRET`**: A strong, random string used to sign JWTs.
    * **`PORT`**: The port on which the Express server will run (default is 5000).
    * **`UPLOAD_DESTINATION`**: The folder where CV files will be stored.
4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server should start on `http://localhost:5000` (or your specified port). Nodemon will monitor for file changes and automatically restart the server.

## API Endpoints

The backend exposes a set of RESTful API endpoints:

* **Authentication (`/api/auth`)**:
    * `POST /api/auth/register`: Register a new user.
    * `POST /api/auth/login`: Authenticate user and return a JWT.
    * `GET /api/auth/me`: Get the current authenticated user's profile.
* **CV Management (`/api/cvs`)**:
    * `POST /api/cvs/upload-cv`: Upload a new CV file and save its metadata.
    * `GET /api/cvs`: Fetch all CVs for the authenticated user (with filtering/pagination).
    * `GET /api/cvs/:id`: Fetch a specific CV by ID.
    * `PUT /api/cvs/:id`: Update CV metadata (e.g., status).
    * `DELETE /api/cvs/:id`: Delete a CV.
    * `GET /api/cvs/download/:id`: Download the original CV file.
    * `GET /api/cvs/stats`: Get aggregated statistics for CVs (total, reviewed, approved, rejected).
* **User Management (`/api/users`)**:
    * `GET /api/users/profile`: Get the authenticated user's profile (can be merged with `/api/auth/me`).
    * `PUT /api/users/profile`: Update the authenticated user's profile.

## Use Cases (Backend's Role)

The backend directly supports the frontend's functionalities by:

* **User Authentication & Authorisation:** Verifying user credentials and ensuring only authenticated users can access protected resources.
* **File Upload & Storage:** Receiving binary CV files, saving them to the designated `uploads` directory, and storing relevant metadata in MongoDB.
* **Data Persistence:** Storing and managing user accounts and all CV-related information (parsed data, status, etc.) in the MongoDB database.
* **Data Retrieval & Filtering:** Efficiently querying the database to fetch CVs based on various criteria (filters, sorting, pagination) requested by the frontend.
* **API for CV Actions:** Providing endpoints to update CV status, delete CVs, and enable their download.
* **Aggregated Statistics:** Calculating and serving real-time statistics about the CV database for the dashboard.

## Current Progress (What's Covered)

* **User Authentication System:** Registration, login, and JWT-based authentication middleware are implemented.
* **Database Integration:** MongoDB connection via Mongoose, with schemas for Users and CVs.
* **CV Upload Handling:** Multer is configured to receive and save CV files, and initial metadata is stored in the database.
* **Basic CRUD for CVs:** Endpoints to create (upload), read (fetch all/by ID), update (status), and delete CVs.
* **File Serving:** Endpoint for downloading original CV files.
* **Authentication Middleware:** Protects routes requiring user login.
* **Error Handling:** Basic middleware for catching and responding to API errors.
* **Dashboard Statistics Endpoint:** Provides counts for total, reviewed, approved, and rejected CVs.

## To Be Done (What's Not Yet Done)

* **Advanced CV Parsing/Extraction:** Implement more sophisticated logic for extracting detailed information (e.g., using libraries like `pdf-parse`, `mammoth.js`, or integrating with external parsing services) beyond basic metadata.
* **CV Scoring Logic:** Develop an algorithm or integrate an AI/ML model to generate a "score" for CVs based on job requirements and extracted skills/experience.
* **Enhanced Filtering & Search:** Implement full-text search capabilities (e.g., using MongoDB's text search) and more complex query builders.
* **Email Sending Integration:** Connect with an email service (e.g., Nodemailer, SendGrid) to send emails directly from the backend.
* **Input Validation:** Comprehensive server-side validation for all incoming request data to prevent bad data and security vulnerabilities.
* **Rate Limiting:** Implement rate limiting to protect against brute-force attacks and abuse.
* **User Roles & Permissions:** Implement different user roles (e.g., admin, recruiter) with varying access levels.
* **Logging:** Implement a robust logging system for monitoring backend activity and debugging.
* **Automated Testing:** Write unit and integration tests for controllers, models, and middleware.
* **Deployment Scripts:** Prepare the backend for production deployment (e.g., PM2, Docker).

## Author

* **juto-shogan** - Lead Developer

## Contributions

Contributions are highly appreciated! If you have suggestions, bug reports, or would like to contribute code, please feel free to open an issue or submit a pull request. Let's build this together!

---
