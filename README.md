# MovieLens Service API

## Description

MovieLens Service API is a TypeScript and Express-based backend service that provides endpoints for managing movie-related data. It uses PostgreSQL as the database and incorporates Zod for data validation.

## Tech Stack

- TypeScript
- Express.js
- PostgreSQL
- Zod for validation
- dotenv for environment variables

## Setup

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/dannycahyo/movie-lens-service
   ```

2. Navigate to the project directory:

   ```bash
   cd movie-lens-service
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root of your project and add your environment variables:

   ```bash
   touch .env
   ```

   Your `.env` file should look something like this:

   ```properties
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=omdb
   ```

5. Build the Docker image for the PostgreSQL service and OMDB database:

   ```bash
   docker build -t movielens-db .
   ```

6. Run the Docker container:

   ```bash
   docker run -e POSTGRES_PASSWORD={your_db_password} --name=omdb-postgres -d -p 5432:5432 --rm movielens-db
   ```

\*Note: Replace {your_db_password} with the password you set for the DB_PASSWORD variable in your .env file. This password is used to set the password for the PostgreSQL user in the Docker container.

## Getting Started

1. To start the server in development mode, run:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000` to see the application running.

3. Use a tool like Postman or curl to make requests to your API.
