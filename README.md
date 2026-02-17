# FitBack API 

This repository contains the RESTful API that powers the **[FitBack](https://github.com/GuilhermeFerrarezz/FitBack)** mobile application. It handles user authentication, data persistence, and provides endpoints to manage gym workout routines, exercises, and sets.

## Features

* **Authentication & Authorization:** Secure user login and registration using JWT (JSON Web Tokens) and Google OAuth integration.
* **Workout Management:** CRUD operations for training sheets (Fichas).
* **Exercise Tracking:** Endpoints to manage specific exercises within a routine, including weight, sets, and repetitions.
* **Relational Database Management:** Structured data modeling using an ORM for scalability and data integrity.

## Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **ORM:** [Sequelize](https://sequelize.org/)
* **Database:** PostgreSQL (Production) / SQLite (Development)
* **Security:** JWT (jsonwebtoken), bcrypt (for password hashing)

## Getting Started

### Prerequisites

To run this project locally, you need to have the following installed:
* [Node.js](https://nodejs.org/en/)
* [Git](https://git-scm.com)
* A SQL Database client (if using PostgreSQL locally)

### Environment Variables

Create a `.env` file in the root directory of the project based on the `.env.example` file (or configure the following variables):

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
## Running the API
```Bash
$ git clone <your-repository-url-here>

# Access the project folder in your terminal
$ cd fitback-api

# Install the dependencies
$ npm install
# Start the development server
$ npm run dev
