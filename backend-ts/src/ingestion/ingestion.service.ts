import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { IngestDocumentDto } from './dto/ingest-document.dto';

@Injectable()
export class IngestionService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async ingestDocument(ingestDocumentDto: IngestDocumentDto) {
    const message = {
      documentUrl: ingestDocumentDto.documentUrl,
      tenantId: ingestDocumentDto.tenantId,
    };

    await this.amqpConnection.publish(
      'document-processing',
      'document.ingest',
      message,
    );

    return { status: 'ok', message: 'Document ingestion job has been queued,' };
  }
}
