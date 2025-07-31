
# OGTL CV Management System

## Project Overview

The OGTL CV Management System is a comprehensive web application designed to streamline the process of managing, reviewing, and organizing candidate CVs. Built with a modern tech stack, it provides features for secure authentication, efficient CV upload and processing, and an interactive dashboard for review and management.

## Project Objective

The primary objective of this project is to create a robust and user-friendly platform that automates the initial stages of the recruitment process. By centralizing CV data and providing tools for quick review and filtering, the system aims to significantly reduce the manual effort involved in handling large volumes of applications, allowing recruiters to focus on qualified candidates.

## Technologies Used

This project leverages a modern full-stack JavaScript ecosystem to deliver a fast, scalable, and maintainable application:

### Frontend

* **React.js:** A declarative, component-based JavaScript library for building user interfaces.
* **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and developer productivity.
* **Vite:** A fast and opinionated build tool for modern web projects, used for rapid development and optimized builds.
* **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs without leaving your HTML.
* **React Router DOM:** For declarative routing within the React application.
* **Axios:** A promise-based HTTP client for making API requests from the browser.
* **Lucide React:** A collection of customizable and tree-shakable SVG icons for React projects.
* **React Dropzone:** A flexible component for building HTML5 drag 'n' drop file areas.

### Backend

* **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
* **Express.js:** A fast, unopinionated, minimalist web framework for Node.js, used for building the RESTful API.
* **MongoDB (with Mongoose):** A NoSQL database for storing CV metadata and user information. Mongoose provides an elegant MongoDB object modeling for Node.js.

### Development Tools & Others

* **ESLint:** For maintaining code quality and consistency.
* **npm / Yarn:** Package managers for project dependencies.

## Use Cases

### For Recruiters/HR Professionals:

* **Secure Authentication:** Log in to a secure system to access and manage sensitive candidate data.
* **Bulk CV Upload:** Easily upload multiple CV files (PDF, DOC, DOCX) at once.
* **Automated Data Extraction:** Have key information (name, experience, skills, contact details, education) automatically extracted and parsed from uploaded CVs.
* **Centralized Dashboard:** View all uploaded CVs in a single, organized dashboard.
* **Filtering and Sorting:** Quickly filter CVs by position, experience, skills, education, location, and status, and sort them by various criteria (e.g., upload date, candidate name, score).
* **CV Status Management:** Update the status of CVs (e.g., "reviewed," "approved," "rejected").
* **Detailed CV Viewing:** Open and review the full content of any uploaded CV.
* **Direct CV Download:** Download original CV files directly from the system.
* **Email Candidates:** Select approved candidates and send personalized emails with CV attachments.
* **Dashboard Analytics:** Gain quick insights into total, approved, reviewed, and rejected CVs.

## Current Progress (What's Covered)

The following core functionalities and architectural components have been implemented:

* **Frontend Development:**

  * **React-based UI:** A responsive and interactive user interface built with React.
  * **Secure Authentication:** Login and Signup forms are functional, integrating with a backend for user authentication using JWT (JSON Web Tokens).
  * **Context API for State Management:** `AuthContext` and `CVContext` are used for global state management related to user authentication and CV data, respectively.
  * **CV Upload Functionality:** Users can upload multiple CV files (PDF, DOC, DOCX).
  * **Dashboard View:** Displays a list of uploaded CVs with basic information.
  * **CV Filtering and Sorting:** Basic filtering by position, experience range, status, and location, as well as sorting by candidate name, experience, upload date, and score.
  * **CV Card Component:** Displays summary information for each CV.
  * **CV Viewer Component:** Allows viewing detailed CV information and downloading the original file.
  * **Email Page:** A basic interface to compose and send emails to approved candidates with attachments.
  * **Styling:** Modern and clean UI with Tailwind CSS.
  * **Routing:** React Router DOM is used for navigation between different pages.
  * **API Integration:** Axios is configured for robust communication with the backend API, including request and response interceptors for authentication and global error handling.
  * **Error Handling:** Basic client-side validation and error display for forms.
* **Backend Development (Conceptual/Implied from Frontend Interaction):**

  * RESTful API endpoints for user authentication (login, signup, profile).
  * RESTful API endpoints for CV management (upload, fetch all, fetch by ID, update, delete, download).
  * File storage mechanism for uploaded CVs.
  * (Assumed) Database integration for storing CV metadata and user information.

## To Be Done (What's Not Yet Done)

While core functionalities are in place, the following areas require further development:

* **Robust CV Parsing/Analysis (Backend):** The current implementation assumes backend parsing is working. Full-fledged automated extraction of *all* CV data points (skills, experience, education, etc.) and AI-powered insights like a "score" need to be robustly implemented on the backend.
* **Real-time Feedback on Uploads:** Enhance `FileUploader.tsx` with more granular progress indicators and individual file upload statuses beyond simple success/error.
* **User Profile Management:** Pages for updating user profiles, company details, etc.
* **Admin Panel:** Functionality for administrators to manage users, view system analytics, and troubleshoot.
* **Advanced Analytics & Reporting:** More detailed insights and reports on recruitment trends.
* **Notifications:** In-app notifications for various actions (e.g., upload completion, status changes).
* **Password Reset/Forgot Password:** Implementation of flows for password recovery.
* **Security Enhancements:** More robust security measures, including input sanitization, rate limiting, and stricter authentication policies.
* **Testing:** Comprehensive unit, integration, and end-to-end tests for both frontend and backend.
* **Deployment & CI/CD:** Scripts and configurations for automated deployment.
* **Backend Error Handling Detail:** More specific error messages from the backend to the frontend for better user feedback.

## Author

* **juto-shogan** - Lead Developer

## Contributions

Contributions are highly appreciated! If you have suggestions, bug reports, or would like to contribute code, please feel free to open an issue or submit a pull request. Let's build this together!

---
