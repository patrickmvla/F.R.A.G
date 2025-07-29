import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestDocumentDto } from './dto/ingest-document.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  ingestDocument(@Body() ingestDocumentDto: IngestDocumentDto) {
    return this.ingestionService.ingestDocument(ingestDocumentDto);
  }
}
