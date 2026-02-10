# Tenpo Application

This project contains a full-stack application with a Spring Boot backend and a React frontend, orchestrated using Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.

## How to Run

1.  **Start the Application**
    Open a terminal in the project root and run:
    ```bash
    docker-compose up -d --build
    ```
    This command builds the images for the backend and frontend and starts all services (Database, API, Frontend) in the background.

2.  **Access the Services**
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend API**: [http://localhost:8080](http://localhost:8080)
    - **Database**: Port `5432`

3.  **View Logs**
    To see the logs of all services:
    ```bash
    docker-compose logs -f
    ```

4.  **Stop the Application**
    To stop and remove the containers:
    ```bash
    docker-compose down
    ```

## Project Structure

- `backend/`: Spring Boot application source code.
- `frontend/`: React application source code.
- `docker-compose.yml`: Docker orchestration configuration.
