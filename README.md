# WebGPT Backend

A backend service that allows users to crawl websites and query the content using AI.

## Features

- Website crawling functionality
- AI-powered querying of crawled content
- User authentication with JWT
- API documentation with Swagger
- Background processing with RabbitMQ

## Technology Stack

- Node.js with Fastify framework
- PostgreSQL database
- RabbitMQ for task queuing
- Docker for containerization
- Google Gemini AI integration

## Prerequisites

- Docker and Docker Compose
- Git

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Debug-Nitin/webgpt-backend.git
cd webgpt-backend
```

### Environment Setup

1. Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

2. Open the `.env` file and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. SSL Configuration:
   - For development environments, SSL is typically disabled (`DB_SSL=false` in the .env file)
   - For production environments with SSL:
     ```
     DB_SSL=true
     ```
   - For production environments with self-signed certificates:
     ```
     DB_SSL=true
     DB_SSL_REJECT_UNAUTHORIZED=false
     ```

### Docker Compose Setup

1. Create your docker-compose.yml file from the example:

```bash
cp docker-compose.example.yml docker-compose.yml
```

2. Edit the docker-compose.yml file to update passwords and secrets:
   - Replace `your_db_password` with a secure database password
   - Replace `your_rabbitmq_password` with a secure RabbitMQ password
   - Replace `your_jwt_secret` with a strong random string for JWT signing

### Running with Docker

To start the entire application stack:

```bash
docker-compose up -d
```

This will start:

- API server on port 3000
- Worker service for background processing
- PostgreSQL database on port 5432
- RabbitMQ on ports 5672 (AMQP) and 15672 (Management UI)

### Access the services

- API Documentation: http://localhost:3000/docs
- RabbitMQ Management: http://localhost:15672 (username: root, password: root@1234)

### Run migrations (if needed)

If you need to run database migrations manually:

```bash
docker-compose exec api node -e "import('./utils/migrate.js').then(m => m.runMigrations())"
```

### View logs

```bash
# API server logs
docker-compose logs -f api

# Worker logs
docker-compose logs -f worker
```

## API Endpoints

The following endpoints are available:

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Log in and get JWT token

### WebGPT Features

- POST `/api/crawl` - Queue a website for crawling
- POST `/api/query` - Query crawled website content with AI
- GET `/api/status` - Check crawler service status

### Testing with Postman

A Postman collection is included in the repository to help you test the APIs easily:

1. Import the collection into Postman:

   - Open Postman
   - Click on "Import" button
   - Select the `webgpt apis.postman_collection.json` file from the repository

2. The collection includes the following API requests:

   - Authentication (Register & Login)
   - Crawl website
   - Query content
   - Check crawler status

3. Before testing:

   - First register a user and login to get a JWT token
   - The JWT token will be automatically used for subsequent requests
   - Update the website URLs in the requests as needed

4. You might need to update the base URL if you're not running the service on localhost:3000

For detailed API documentation, visit the `/api-reference` endpoint after starting the server.

## Development

### Running locally

```bash
# Install dependencies
npm install

# Start the API server
npm run dev

# Start the worker in a separate terminal
npm run worker
```

### Database migrations

The application will automatically run migrations on startup. To manually run migrations:

```bash
node -e "import('./utils/migrate.js').then(m => m.runMigrations())"
```

## Troubleshooting

If you encounter issues:

1. Check logs for errors: `docker-compose logs -f`
2. Ensure all required environment variables are set
3. For connectivity issues, check that all services are running: `docker-compose ps`

## License

[ISC License](LICENSE)
