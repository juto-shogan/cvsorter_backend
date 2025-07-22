# OGTL CV Management System - Backend

## Project Overview

This repository contains the backend application for the OGTL CV Management System. It is built with Node.js and Express.js, providing a robust and secure API for handling the entire CV lifecycle, from user authentication to automated CV analysis and data management. It serves as the data and logic layer for the accompanying React-based frontend application.

## Backend Use Cases and Responsibilities

The backend is responsible for the core business logic and data persistence of the OGTL CV Management System. Its primary use cases and responsibilities include:

* **User Authentication and Authorization:** Manages user registration, login, and ensures secure access to protected resources using JSON Web Tokens (JWT). It validates user credentials and maintains session integrity.
* **Secure CV Upload and Storage:** Receives CV files (PDF, DOC, DOCX) from the frontend, validates their type and size, stores them securely on the server, and associates them with the uploading user.
* **Automated CV Data Extraction and Analysis:** Extracts textual content from uploaded CVs and processes it using a specialized CV analysis service. This includes identifying candidate information (name, contact details, experience, skills) and assigning a relevance score based on predefined criteria.
* **CV Data Management (CRUD Operations):** Provides comprehensive API endpoints for creating, reading, updating, and deleting CV records, including updating their status (e.g., pending, reviewed, shortlisted, rejected).
* **Real-time Analytics Calculation:** Aggregates and calculates key performance indicators (KPIs) such as total, pending, reviewed, shortlisted, and rejected CV counts. This data is exposed for the frontend dashboard.
* **API Provisioning for Frontend:** Acts as the central data provider for the frontend, exposing a well-defined RESTful API that the React application consumes to render dynamic content and manage user interactions.

## Technologies Used

* **Runtime:** Node.js
* **Web Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **File Upload:** Multer
* **Authentication:** JWT (jsonwebtoken), Bcrypt.js (password hashing)
* **CORS Management:** `cors` middleware
* **Security Headers:** `helmet` middleware
* **Environment Variables:** `dotenv`
* **PDF Text Extraction:** `pdf-parse` or `pdfreader`
* **DOCX Text Extraction:** `mammoth`

## Project Structure

The backend follows a modular structure to ensure maintainability and scalability:

```
ogtl-backend/

├── src/

│   ├── config/                     # Database connection, JWT token generation

│   │   └── database.js

│   │   └── generateToken.js

│   ├── controllers/                # Request handlers for routes

│   │   ├── authController.js

│   │   ├── cvController.js

│   │   └── analyticsController.js

│   ├── middleware/                 # Express middleware (auth, validation, upload)

│   │   ├── auth.js                 # JWT authentication middleware

│   │   ├── upload.js               # Multer configuration for file uploads

│   │   └── validation.js           # Input validation (e.g., Joi/Express-Validator)

│   ├── models/                     # Mongoose schemas for MongoDB collections

│   │   ├── User.js

│   │   ├── CV.js

│   │   └── Analytics.js (if separate collection)

│   ├── routes/                     # API endpoint definitions

│   │   ├── auth.js

│   │   ├── cvs.js

│   │   └── analytics.js

│   ├── services/                   # Business logic and external integrations

│   │   ├── cvAnalyzer.js           # Handles CV text analysis and scoring

│   │   ├── fileProcessor.js        # Abstracts file text extraction (PDF/DOCX) and deletion

│   │   └── analyticsService.js     # Calculates dashboard statistics

│   └── app.js                      # Central Express application setup

├── uploads/                        # Directory for temporary/permanent CV file storage

├── .env.example                    # Example environment variables

├── package.json                    # Project dependencies and scripts

└── server.js                       # Entry point for starting the server

```

## Getting Started

Follow these steps to set up and run the backend server locally.

### Prerequisites

* **Node.js:** Ensure Node.js (LTS version recommended) is installed on your system.
* **npm:** Node Package Manager, which comes with Node.js.
* **MongoDB:** A running MongoDB instance (local or cloud-hosted like MongoDB Atlas).

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/juto-shogan/ogtl-cv-management-system.git](https://github.com/juto-shogan/ogtl-cv-management-system.git) # Replace with actual backend repo URL
   cd ogtl-cv-management-system/ogtl-backend # Adjust path if your backend is in a subfolder
   ```

   (Note: If this is a new project setup, you would create the `ogtl-backend` directory and initialize `npm` first.)
2. **Install dependencies:**

   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root of your `ogtl-backend` directory (at the same level as `package.json`). Populate it with the following required variables:

```env
# MongoDB Connection URI
MONGO_URI=mongodb://localhost:27017/ogtl-cv-management
# Example for MongoDB Atlas: MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ogtl-cv-management?retryWrites=true&w=majority

# JSON Web Token (JWT) Secret Key
JWT_SECRET=your_strong_secret_key_here_for_jwt_signing_and_verification
JWT_EXPIRES_IN=24h # Example: Token expires in 24 hours

# Server Port
PORT=5000

# Node.js Environment (e.g., development, production)
NODE_ENV=development

# Frontend URL (for CORS policy)
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `your_strong_secret_key_here_for_jwt_signing_and_verification` with a unique, long, and random string. For production, never hardcode secrets.

### Running the Server

1. **Start the development server:**
   **Bash**

   ```
   npm run dev
   ```

   The backend server will start on `http://localhost:5000` (or the port specified in your `.env` file).
2. Verify:
   You should see console output indicating that the database is connected and the server is listening on the specified port.

## API Endpoints

The backend exposes the following RESTful API endpoints:

### Authentication

* `POST /api/auth/register`
  * **Description:** Registers a new HR user.
  * **Body:** `{ username, email, password }`
  * **Response:** `{ success, message, user: { id, username, email, role }, token }`
* `POST /api/auth/login`
  * **Description:** Authenticates a user and issues a JWT.
  * **Body:** `{ email, password }`
  * **Response:** `{ success, message, user: { id, username, email, role }, token }`
* `GET /api/auth/profile`
  * **Description:** Retrieves the profile of the authenticated user.
  * **Headers:** `Authorization: Bearer <JWT_TOKEN>`
  * **Response:** `{ success, message, user: { id, username, email, role } }`

### CV Management

* `POST /api/cvs/upload`
  * **Description:** Uploads a CV file, processes it, and saves its data.
  * **Headers:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: multipart/form-data`
  * **Body:** `formData.append('cv', file)` (where 'cv' is the field name for the file)
  * **Response:** `{ success, message, cvData: { ... } }`
* `GET /api/cvs`
  * **Description:** Retrieves all CVs uploaded by the authenticated user.
  * **Headers:** `Authorization: Bearer <JWT_TOKEN>`
  * **Response:** `Array<CV_Object>`
* `PATCH /api/cvs/:id`
  * **Description:** Updates the status or other metadata of a specific CV.
  * **Headers:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: application/json`
  * **Body:** `{ status: 'reviewed' | 'shortlisted' | 'rejected' }` (or other fields)
  * **Response:** `{ success, message, updatedCV: { ... } }`
* `DELETE /api/cvs/:id`
  * **Description:** Deletes a specific CV record and its associated file.
  * **Headers:** `Authorization: Bearer <JWT_TOKEN>`
  * **Response:** `{ success, message }`
* `GET /api/cvs/:id/download`
  * **Description:** Downloads the original uploaded CV file.
  * **Headers:** `Authorization: Bearer <JWT_TOKEN>`
  * **Response:** The raw file content for download.

### Analytics

* `GET /api/analytics/dashboard`
  * **Description:** Retrieves aggregated analytics data for the dashboard (e.g., total, pending, reviewed, shortlisted, rejected CV counts).
  * **Headers:** `Authorization: Bearer <JWT_TOKEN>`
  * **Response:** `{ totalCVs, pendingCVs, reviewedCVs, shortlistedCVs, rejectedCVs }`

## Core Services and Logic

* **`cvAnalyzer.js`** : This service contains the critical logic for parsing the extracted text from CVs. It identifies key candidate information (name, email, phone, experience, skills) and assigns a relevance score based on configured job role keywords and criteria. This is where your converted Python logic resides.
* **`fileProcessor.js`** : An abstraction layer for handling file-system operations. It is responsible for extracting text from various document formats (PDF, DOCX) and managing file deletion after processing or upon record removal.
* **`analyticsService.js`** : This service performs database aggregations to calculate and provide the necessary metrics for the dashboard, ensuring data consistency and efficiency.

## Database Schema (MongoDB)

### User Model (`src/models/User.js`)

Represents an HR user with fields for authentication and profile management.

* `username` (String, required, unique)
* `email` (String, required, unique)
* `password` (String, hashed, required)
* `role` (String, default: 'hr', enum: ['hr', 'admin'])
* `createdAt`, `updatedAt` (Timestamps)

### CV Model (`src/models/CV.js`)

Stores metadata about uploaded CVs, extracted candidate information, and analysis results.

* `fileName` (String, required)
* `filePath` (String, required, path to stored file)
* `fileSize` (Number, required)
* `mimeType` (String, required)
* `uploadedBy` (ObjectId, references User, required)
* `candidateName` (String, required)
* `position` (String, required)
* `experience` (Number, required, years)
* `skills` (Array of Strings)
* `education` (String)
* `location` (String)
* `email` (String)
* `phone` (String)
* `score` (Number, 0-100)
* `analysisData` (Mixed, stores raw output from analysis)
* `matchingCriteria` (Object, details on skill, experience, education match)
* `status` (String, enum: 'pending', 'reviewed', 'shortlisted', 'rejected', default: 'pending')
* `uploadDate`, `reviewedDate`, `shortlistedDate`, `rejectedDate` (Dates)
* `createdAt`, `updatedAt` (Timestamps)

## Security and Performance Considerations

* **JWT Security:** JWTs are used for stateless authentication. Ensure `JWT_SECRET` is strong and kept confidential. Token expiration is configured.
* **CORS Policy:** Configured to allow requests only from the specified `FRONTEND_URL`.
* **File Upload Security:** Multer is configured with file type validation (PDF/DOC/DOCX only) and file size limits to prevent malicious uploads. Files are stored on the server file system.
* **Data Validation:** Middleware for request body validation is planned to ensure data integrity and prevent common injection attacks.
* **Error Handling:** Centralized error handling is implemented to catch and respond to API errors gracefully.
* **Database Indexes:** To optimize query performance, relevant indexes will be added to frequently queried fields in MongoDB (e.g., `uploadedBy`, `status`).

## Contributing

For contributions, please fork the repository and submit a pull request with your changes. Ensure your code adheres to the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact **juto-shogan** at somtombonu53@gmail.com.

---

Here's a concise and professional `README.md` specifically for your backend project, designed for developers to easily understand and set up. It focuses on the backend's responsibilities and technical details, without emojis.

---
