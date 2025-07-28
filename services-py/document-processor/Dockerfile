#------------------------------------------------------------------------------------
# Stage 1: Builder
# This stage builds a virtual environment with all necessary packages.
# It can include build-time dependencies without bloating the final image.
#------------------------------------------------------------------------------------
FROM python:3.11-slim AS builder

# Set environment variables for best practices with Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1         

# Set up a virtual environment
WORKDIR /opt/venv
RUN python -m venv .
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies from requirements.txt
COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

#------------------------------------------------------------------------------------
# Stage 2: Production
# This stage creates the final, lean production image. It takes the virtual
# environment from the 'builder' stage and adds the application code.
#------------------------------------------------------------------------------------
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Create a non-root user and group
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --gid 1001 appuser

# Set the working directory
WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy the application code. Ensure a .dockerignore file exists.
# Set ownership to the non-root user.
COPY --chown=appuser:appgroup ./app .

# Activate the virtual environment and switch to the non-root user
ENV PATH="/opt/venv/bin:$PATH"
USER appuser

# Expose the port
EXPOSE ${PORT}

# Command to run the application
# Using ${PORT} makes the port configurable at runtime.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${PORT}"]