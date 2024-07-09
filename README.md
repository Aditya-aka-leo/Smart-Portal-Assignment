<h1 align="center">Node.js Backend Engineer Assignment 🧭</h1>

## 📚 | Problem Statement

- Develop a microservices-based real-time notification system.
- Handle high-volume message processing and deliver real-time notifications to users.
- Integrate message queues and implement real-time data streaming.
- The system should run on port `3000` by default.

### Requirements

- **Node.js and Express**: Use Node.js with the Express framework to build the services.
- **Database**: Use MongoDB to store data. Use Mongoose for ORM.
- **Message Queue**: Use Kafka for message queuing.
- **Real-Time Streaming**: Use WebSocket or Socket.IO for real-time data streaming.
- **Authentication**: Implement JWT (JSON Web Token) for authentication.
- **API Documentation**: Provide API documentation using Swagger.

### Specifications

#### Entities

- **User**
  - `id` (UUID)
  - `username` (string)
  - `email` (string)
  - `password` (hashed string)
  - `connected` (boolean, indicates if the user is connected to the real-time service)

- **Notification**
  - `id` (UUID)
  - `userId` (reference to User)
  - `message` (string)
  - `read` (boolean)

#### Services

- **Auth Service**
  - `POST /api/register`: Register a new user.
  - `POST /api/login`: Login and receive a JWT.

- **Notification Service**
  - `POST /api/notifications`: Create a new notification for a user. This should push a message to the queue.
  - `GET /api/notifications`: Get a list of all notifications for the authenticated user.
  - `GET /api/notifications/:id`: Get details of a specific notification.
  - `PUT /api/notifications/:id`: Mark a notification as read.

- **Real-Time Service**
  - Establish a WebSocket connection for real-time notifications.
  - Listen for new notifications from the queue and broadcast them to the connected users.

### Technical Requirements

- Follow RESTful principles.
- Handle errors gracefully and return appropriate HTTP status codes.
- Use environment variables for configuration.
- Ensure code quality with a linter (ESLint).

### Deliverables

- **Source Code**: A GitHub repository with the complete source code.

### Bonus (Optional)

- Implement user roles and permissions.
- Add pagination for the GET endpoints.
- Deploy the application to a cloud service (e.g., Heroku, AWS).
- Implement a retry mechanism for failed message processing.
- Use GraphQL instead of REST for the API.
- Docker: Dockerfile and docker-compose.yml to run the services.

### Setup Instructions

1. **Clone this repository**.
2. **Install Docker Desktop**.
3. **Run `docker-compose up --build`** in the root directory of the project. This process takes a minute or two to complete for the first time.
4. You might have to stop the containers and run the command again because the Kafka containers sometimes take some time to create superusers upon the first-time container start, causing the consumer to fail.
5. The Web UI will be available at `http://localhost:3000/static/index.html`.

### Note

- The Web UI is very basic and is only meant for testing the API.

### System Design

<p align="center">
    <img alt="System Design" src="https://raw.githubusercontent.com/muKaustav/dyte_log_server/main/assets/system_des.png" target="_blank" />
</p>

### Features Implemented

- Web UI running on port `3000`.
- Real-time notifications using WebSocket or Socket.IO.
- JWT authentication for securing the endpoints.
- Kafka for message queuing with three topics:
  - `Push-Notification`
  - `Notify-Online-Users`
  - `Replay-Failed-Notification`
- MongoDB for storing user and notification data.
- Swagger API documentation.
- Replay system using MongoDB cron worker and Kafka.

### Swagger Documentation
