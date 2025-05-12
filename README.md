# Tika Service

A dockerized Apache Tika service with an optional Express API wrapper.

## Features

- Apache Tika server for text extraction from various document formats
- Optional Express API with authentication and logging
- Ready for Railway deployment
- Docker Compose for local development

## Local Development

```bash
# Start the service
docker-compose up -d

# Test the Tika server directly
curl -X GET http://localhost:9998/tika

# Test the API wrapper (if using)
curl -X GET http://localhost:3000/health