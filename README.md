# F.R.A.G - Financial Research & Analysis GPT

**F.R.A.G** is a next-generation AI-powered platform designed to serve as a specialized financial analyst and advisor. It leverages a sophisticated Retrieval-Augmented Generation (RAG) architecture to provide deep, contextual insights by synthesizing information from a vast public knowledge base with private, proprietary documents uploaded by clients.

## 🚀 Mission

Our mission is to democratize elite-level financial analysis, enabling companies of all sizes to make smarter, data-driven decisions. By combining the power of Large Language Models with a secure, multi-tenant architecture, we transform complex financial data into clear, actionable advice.

## ✨ Features

- **Hybrid Knowledge Base:** Ingests and indexes data from public sources (SEC filings, news APIs, economic data) and private, user-uploaded documents.
- **Multi-Tenant Security:** A robust, secure architecture ensures that each client's private data is strictly isolated and accessible only to them.
- **Advanced RAG Pipeline:** Goes beyond simple vector search by using a multi-modal index (Vector, Keyword, Graph) and a sophisticated re-ranking model to find the most relevant context.
- **On-the-Fly Analysis:** Users can upload a document and ask questions about it in the context of the platform's global knowledge base for immediate insights.
- **Cross-Standardization:** Automatically understands and standardizes financial terms across different accounting standards (e.g., IFRS vs. GAAP).

## 🏗️ Architecture Overview

The platform is built on a modern, hybrid microservices model designed for scalability and maintainability.

- **TypeScript (NestJS) Backend:** The core API that handles all user authentication, business logic, and orchestration.
- **Python (FastAPI) Microservices:** Specialized services dedicated to heavy AI/ML tasks like document parsing, data extraction, and model inference.
- **Message Queue (RabbitMQ):** Decouples the main backend from the Python services, ensuring resilience, fault tolerance, and scalability in our data processing pipeline.
- **Multi-Modal Database Layer:** Utilizes multiple specialized databases to handle different types of queries effectively (Weaviate for semantic search, Elasticsearch for keyword search, Neo4j for relational search).

## 🛠️ Technology Stack

| Category              | Technology                                       |
| --------------------- | ------------------------------------------------ |
| **Backend API** | TypeScript, NestJS                               |
| **AI/ML Services** | Python, FastAPI                                  |
| **AI/ML Libraries** | Hugging Face Transformers, Unstructured.io, spaCy|
| **Frontend** | React, Next.js, TypeScript                       |
| **Vector Database** | Weaviate                                         |
| **Keyword Database** | Elasticsearch                                    |
| **Graph Database** | Neo4j                                            |
| **Metadata Database** | PostgreSQL (Neon)                                |
| **ORM** | Drizzle ORM                                      |
| **Message Queue** | RabbitMQ                                         |
| **Object Storage** | Cloudflare R2                                    |
| **Containerization** | Docker, Docker Compose                           |

## 🏁 Getting Started

Follow these instructions to set up the development environment on your local machine.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/)

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd financial-rag-platform
    ```

2.  **Create the environment file:**
    Create a file named `.env` in the root of the project. This file will hold all your secret credentials for services like Neon and Cloudflare R2. Start by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in your `.env` file.

3.  **Build and run the services:**
    Use Docker Compose to build the images and launch all the services.
    ```bash
    docker-compose up --build -d
    ```
    This command will start all the necessary databases, the message queue, and our custom application services in detached mode.

4.  **Verify the services:**
    You can check the status of the running containers with `docker-compose ps`. You can also access the web UIs for the infrastructure services:
    - **RabbitMQ:** `http://localhost:15672`
    - **Weaviate:** `http://localhost:8080`
    - **Elasticsearch:** `http://localhost:9200`
    - **Neo4j:** `http://localhost:7474`

## 📂 Project Structure

This project uses a monorepo structure to manage the different services in one place.

```plaintext
/financial-rag-platform/
|
|-- 📂 backend-ts/         # Main TypeScript (NestJS) Application
|-- 📂 services-py/         # All Python Microservices
|-- 📂 frontend/            # React/Next.js Client Application
|
|-- 📜 docker-compose.yml   # Defines all services for local development
|-- 📜 README.md            # This file
`-- 📜 .gitignore           # Specifies files to ignore in git
```

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
