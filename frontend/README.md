Got it! Here's a `README.md` specifically for the frontend part of your project, detailing its structure, technologies, and features.

**Markdown**

```
# OGTL CV Management System - Frontend

## Project Overview

This is the frontend client for the OGTL CV Management System, a modern, responsive single-page application (SPA) built with React and TypeScript. It provides a user-friendly interface for recruiters to interact with the backend API, enabling secure authentication, efficient CV uploading, comprehensive dashboard views, and tools for managing and reviewing candidate applications.

## Project Objective

The main objective of the frontend is to deliver an intuitive and performant user experience for managing CVs. It aims to visualize candidate data clearly, provide powerful filtering and sorting capabilities, and facilitate core recruitment workflows like CV upload, status updates, and candidate communication, all while maintaining a secure and responsive interface.

## Technologies Used

The frontend leverages a cutting-edge stack to provide a robust and dynamic user interface:

* **React.js:** A declarative JavaScript library for building interactive user interfaces.
* **TypeScript:** A strongly typed superset of JavaScript that enhances code quality, readability, and maintainability.
* **Vite:** A next-generation frontend tooling that provides an extremely fast development experience and optimized build process.
* **Tailwind CSS:** A utility-first CSS framework that enables rapid UI development and highly customizable designs directly in markup.
* **React Router DOM:** For declarative client-side routing, managing navigation between different views.
* **Axios:** A robust, promise-based HTTP client used for making requests to the backend API, featuring interceptors for authentication and error handling.
* **Lucide React:** A beautiful and consistent icon library, integrated for clear visual cues throughout the application.
* **React Dropzone:** A flexible component providing HTML5 drag 'n' drop file upload capabilities.
* **Context API:** React's built-in state management solution used to manage global state like authentication (`AuthContext`) and CV data (`CVContext`).

## Project Structure

The frontend is organized into logical directories to ensure modularity and ease of development:

```

frontend/

├── public/                # Static assets (e.g., index.html, favicon)

├── src/                   # Main application source code

│   ├── assets/            # Images, fonts, or other media files

│   ├── components/        # Reusable UI components

│   │   ├── Auth/          # Login and Signup forms

│   │   ├── Dashboard/     # CVCard, CVViewer, FilterPanel, Stats cards

│   │   ├── Layout/        # Navbar

│   │   └── Upload/        # FileUploader

│   ├── contexts/          # React Context API providers for global state

│   │   ├── AuthContext.tsx

│   │   └── CVContext.tsx

│   ├── pages/             # Top-level components for different routes

│   │   ├── AuthPage.tsx

│   │   ├── Dashboard.tsx

│   │   ├── EmailPage.tsx

│   │   └── UploadPage.tsx

│   ├── services/          # API service configurations (e.g., Axios instance)

│   │   └── api.ts

│   ├── types/             # TypeScript interfaces and types

│   │   └── index.ts

│   ├── utils/             # Utility functions (e.g., formatFileSize)

│   │   └── helpers.ts

│   ├── App.tsx            # Main application component, handles routing and context providers

│   ├── main.tsx           # Entry point for the React application

│   └── index.css          # Global Tailwind CSS imports and custom styles

├── package.json           # Project metadata and dependencies

├── postcss.config.js      # PostCSS configuration for Tailwind CSS

├── tailwind.config.js     # Tailwind CSS configuration

├── tsconfig.json          # TypeScript configuration

├── vite.config.ts         # Vite build tool configuration

└── README.md              # This file

```

## Setup and Installation

Follow these steps to set up and run the frontend locally:

1.  **Ensure Node.js is installed.**
2.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ogtl-cv-management-system/frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
4.  **Create a `.env` file:**
    Create a file named `.env` in the `frontend/` directory and add your backend API base URL:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
    * **`VITE_API_BASE_URL`**: This should point to your running backend API.
5.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically open in your browser at `http://localhost:5173` (or another available port).

## Key Features

* **User Authentication:** Secure login and registration forms.
* **Dashboard:** Centralized view of all uploaded CVs with statistics.
* **CV Upload:** Drag-and-drop interface for uploading multiple CV files (PDF, DOC, DOCX).
* **Filtering & Sorting:** Dynamic filtering by position, experience, status, location, and comprehensive sorting options.
* **CV Details Viewer:** Modal view for detailed CV information and direct download of original files.
* **CV Status Management:** Easily update CV statuses (e.g., reviewed, approved, rejected).
* **Email Management:** A dedicated page to compose and send emails to approved candidates, with options to include CV attachments.
* **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.
* **Global State Management:** Efficient state handling for user authentication and CV data using React Context API.
* **Robust API Communication:** Configured with Axios for secure and error-handled requests.

## Current Progress (What's Covered)

* **Authentication Flow:** Login, registration, and session management using JWTs stored in local storage.
* **Protected Routes:** Only authenticated users can access core application pages.
* **CV Display:** Lists CVs in a card-based layout on the dashboard.
* **Interactive Filters:** Functional filters for `position`, `min/maxExperience`, `status`, and `location`.
* **Dynamic Sorting:** Sort CVs by `name`, `experience`, `uploadDate`, and `score`.
* **File Upload Component:** `FileUploader.tsx` with drag-and-drop, validation, and progress indicators.
* **CV Viewer:** Displays extracted CV data and allows downloading the original file.
* **Email Page:** Basic UI for composing emails and listing approved candidates for outreach.
* **Global Contexts:** `AuthContext` and `CVContext` are set up and providing data to relevant components.
* **Axios Interceptors:** For automatically adding authorization tokens to requests and global error handling (e.g., redirecting on 401).

## To Be Done (What's Not Yet Done)

* **Enhanced Real-time Upload Feedback:** More granular progress bars per file and more detailed success/error states for individual uploads.
* **User Profile Management:** Pages for users to view and update their profile information.
* **Advanced UI/UX Enhancements:** Implement features like infinite scrolling/pagination for large CV lists, more interactive data visualizations for dashboard stats, and potentially a more sophisticated skill multi-select.
* **Form Validation:** More advanced and user-friendly form validation for all forms (e.g., using a library like Zod or Yup).
* **Notifications System:** Implement toast notifications or a similar system for user feedback on actions (e.g., "CV updated successfully!").
* **Accessibility Improvements:** Ensure the application meets accessibility standards.
* **Unit & Integration Tests:** Comprehensive testing for React components, hooks, and context logic.

## Author

* **juto-shogan** - Lead Developer

## Contributions

Contributions are highly appreciated! If you have suggestions, bug reports, or would like to contribute code, please feel free to open an issue or submit a pull request. Let's build this together!

---
```
