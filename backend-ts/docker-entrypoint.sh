#!/bin/sh
# This script makes the 'Initialization_Failed' state unrepresentable
# by failing immediately if configuration is missing.
set -e # Exit on error
set -u # Exit on unset variable

# This script will fail here if RABBITMQ_HOST or RABBITMQ_PORT are not set.
echo "Entrypoint: Verifying dependency at ${RABBITMQ_HOST}:${RABBITMQ_PORT}..."

# Loop until the dependency is network-reachable.
while ! nc -z "${RABBITMQ_HOST}" "${RABBITMQ_PORT}"; do
  echo "Dependency is unavailable - sleeping"
  sleep 1
done

echo "Dependency is available - executing application"

# Execute the main process.
exec "$@"