import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

@Module({
  imports: [],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
