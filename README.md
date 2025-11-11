# Social Media Content Scheduler — Backend

A Node.js REST API for scheduling and managing social media content. Provides user authentication (JWT), content CRUD, and scheduling support. Built with Express and MongoDB.

Table of contents
- [Key features](#key-features)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Content / Posts](#content--posts)
- [Project structure](#project-structure)
- [Data models](#data-models)
- [Scripts](#scripts)
- [Security & production notes](#security--production-notes)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License & support](#license--support)

## Key features
- User registration & login with JWT-based authentication
- Create, read, update, delete posts
- Schedule posts for future publishing
- MongoDB for persistence
- Clean, RESTful API endpoints
- Middleware for authentication and error handling

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud; e.g., Atlas)

## Getting started

1. Clone the repository
```bash
git clone <your-repository-url>
cd social-media-content-scheduler-backend
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the project root (see [Environment variables](#environment-variables))

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Start production server
```bash
npm start
```

## Environment variables

Create a `.env` in the project root and set at minimum:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-scheduler
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

Recommended production variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

## API Reference

Base URL (development):
http://localhost:5000/api

All protected endpoints require the Authorization header:
Authorization: Bearer <jwt-token>

Authentication
- Register a new user
  - Endpoint: POST /api/auth/register
  - Body:
    ```json
    {
      "username": "user123",
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response: 201 Created (returns user info and token)

- Login
  - Endpoint: POST /api/auth/login
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - Response: 200 OK (returns JWT token and user info)

Content / Posts
- Get all posts for the authenticated user
  - Endpoint: GET /api/content/posts
  - Headers: Authorization: Bearer <token>
  - Query parameters (optional): ?status=scheduled|published|draft
  - Response: 200 OK (array of posts)

- Create a new post
  - Endpoint: POST /api/content/posts
  - Headers: Authorization: Bearer <token>
  - Body:
    ```json
    {
      "content": "Post content here",
      "scheduleTime": "2025-01-01T10:00:00.000Z",
      "platform": "twitter",
      "status": "scheduled"
    }
    ```
  - Response: 201 Created (created post resource)

- Update a post
  - Endpoint: PUT /api/content/posts/:id
  - Headers: Authorization: Bearer <token>
  - Body: fields to update (content, scheduleTime, platform, status)
  - Response: 200 OK (updated post)

- Delete a post
  - Endpoint: DELETE /api/content/posts/:id
  - Headers: Authorization: Bearer <token>
  - Response: 204 No Content

Notes
- scheduleTime must be an ISO 8601 datetime string (UTC recommended).
- The backend is responsible for storing scheduled posts; an external worker or scheduled job (cron) should handle actual publishing to social platforms (if integrated).

## Project structure

A typical layout for this backend:

backend/
├── controllers/        # Route controllers (business logic)
├── models/             # Mongoose models
├── routes/             # Express route definitions
├── middleware/         # Auth, validation, error handling
├── config/             # DB and app configuration
├── jobs/               # Background jobs or schedulers (optional)
├── tests/              # Unit/integration tests
├── package.json
└── server.js           # Application entry point

## Data models (summary)

User
```json
{
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "createdAt": "Date"
}
```

Post
```json
{
  "content": "string",
  "scheduleTime": "Date",
  "platform": "string",
  "status": "string (draft|scheduled|published)",
  "userId": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Scripts

Defined in package.json; common scripts include:
```bash
npm run dev    # Start with nodemon for development
npm start      # Start production server
npm test       # Run test suite
```

## Security & production notes
- Always use strong, long JWT secrets in production and keep them in environment variables or secret managers.
- Hash passwords (bcrypt or Argon2 recommended) before storing.
- Use HTTPS in production and set secure cookie flags where applicable.
- Consider rate limiting and request validation to protect against abuse.
- Sanitize/validate inputs to prevent injection vulnerabilities.
- Use a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) for production credentials.

## Deployment

Render / Heroku / Vercel (server) example:
1. Push your branch to GitHub.
2. Create a new service on your chosen host and connect the repository.
3. Set environment variables in the provider dashboard (MONGODB_URI, JWT_SECRET, NODE_ENV, PORT).
4. Deploy from the main/master branch and monitor logs for runtime errors.

If using scheduled jobs (for publishing), either:
- Configure a background worker or cron on your host, or
- Use an external scheduler (e.g., GitHub Actions, provider cron) to POST to an internal endpoint that triggers publishing.

## Contributing
1. Fork the repository
2. Create a feature branch (git checkout -b feat/your-feature)
3. Run tests and linters locally
4. Commit your changes and open a pull request with a clear description

Please follow conventional commits or your team's commit message convention.

## License & support
This project is provided under the MIT License (or choose the appropriate license for your project).

For issues or support, please open an issue in this repository describing:
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs and environment variables (do not include secrets)

---

Maintainers
- Faizan Aziz — https://github.com/Faizan-Aziz

If you want, I can also:
- Add API examples with full request/response bodies and sample tokens
- Create Postman / OpenAPI (Swagger) documentation
- Add CI configuration and GitHub Actions workflows

```
