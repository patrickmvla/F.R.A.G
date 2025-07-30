import pika
import time
import os
import boto3
import json
from unstructured.partition.auto import partition
from io import BytesIO

RABBITMQ_URI = "amqp://user:password@rabbitmq:5672/%2F"
EXCHANGE_NAME = 'document-processing'
QUEUE_NAME = 'document-ingestion-queue'
ROUTING_KEY = 'document.ingest'

# --- R2/S3 Connection Details ---
R2_ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")

s3_client = boto3.client(
    's3',
    endpoint_url = R2_ENDPOINT_URL,
    aws_access_key_id = R2_ACCESS_KEY_ID,
    aws_secret_access_key = R2_SECRET_ACCESS_KEY,
    region_name = 'auto' 
)

def on_message_received(ch, method, properties, body):
    """Callback function to process a message from the queue."""
    print(f" [x] Received message...")
    try:
        message_data = json.loads(body.decode())
        document_url = message_data.get('documentUrl')

        if not document_url:
            print(" [!] Message is missing 'documentUrl'. Skipping.")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return

        # The documentUrl is expected to be the key (path) in the S3 bucket
        print(f" [*] Downloading document: {document_url} from bucket: {R2_BUCKET_NAME}")
        
        # Download the file into memory
        response = s3_client.get_object(Bucket=R2_BUCKET_NAME, Key=document_url)
        file_content = response['Body'].read()
        
        print(f" [*] Parsing document...")
        # Use unstructured to partition the document from the in-memory content
        elements = partition(file=BytesIO(file_content))
        
        print(f" [✔] Successfully parsed document. Found {len(elements)} elements.")
        
        # Acknowledge the message was processed successfully
        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print(f" [✖] Error processing message: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def main():
    """Main function to start the consumer."""
    print(' [*] Waiting for messages. To exit press CTRL+C')

    connection = None
    for i in range(10):
        try:
            connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URI))
            break
        except pika.exceptions.AMQPConnectionError:
            print(f"Connection failed, retrying in 5 seconds... (attempt {i+1}/10)")
            time.sleep(5)

    if not connection:
        print(" [✖] Could not connect to RabbitMQ. Exiting.")
        return

    channel = connection.channel()
    channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type='topic', durable=True)
    result = channel.queue_declare(queue=QUEUE_NAME, durable=True)
    queue_name = result.method.queue
    channel.queue_bind(queue=queue_name, exchange=EXCHANGE_NAME, routing_key=ROUTING_KEY)
    channel.basic_consume(queue=queue_name, on_message_callback=on_message_received)

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
    finally:
        if connection and connection.is_open:
            connection.close()
            print("Connection closed.")

if __name__ == '__main__':
    main()
