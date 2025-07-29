// src/messaging/messaging.module.ts

import { Global, Logger, Module } from '@nestjs/common';
import {
  RabbitMQModule,
  AmqpConnection,
  MessageHandlerErrorBehavior,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * A custom provider for exposing a simple connection metric.
 * In a production system, this would be replaced by a proper metrics library like prom-client.
 * The value `isConnected` will be 1 for connected, 0 for disconnected.
 * This can be exposed via a /metrics endpoint for Prometheus scraping.
 */
export const RABBITMQ_CONNECTION_METRIC = 'RABBITMQ_CONNECTION_METRIC';
export const rabbitmqConnectionMetricProvider = {
  provide: RABBITMQ_CONNECTION_METRIC,
  useValue: { isConnected: 0 },
};

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, RABBITMQ_CONNECTION_METRIC],
      useFactory: (
        configService: ConfigService,
        metric: { isConnected: number },
      ) => {
        const logger = new Logger(MessagingModule.name);
        const uri = configService.get<string>('RABBITMQ_URI');

        if (!uri) {
          logger.error(
            'RABBITMQ_URI is not defined in environment variables. Application will not start.',
          );
          throw new Error('RABBITMQ_URI is not defined.');
        }

        return {
          exchanges: [
            {
              name: 'document-processing',
              type: 'topic',
            },
          ],
          uri: uri,
          connectionInitOptions: { wait: true, timeout: 30000 },
          defaultRpcErrorBehavior: MessageHandlerErrorBehavior.REQUEUE,
          defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.REQUEUE,
          connectionManagerOptions: {
            connectionOptions: {},
            // FIX: The 'connection' parameter is prefixed with an underscore to indicate it's intentionally unused.
            onConnect: (_connection: AmqpConnection) => {
              metric.isConnected = 1;
              logger.log({
                message: 'Successfully connected to RabbitMQ broker',
                uri: uri.replace(/:.*@/, ':****@'),
              });
            },
            onDisconnect: (err: Error) => {
              metric.isConnected = 0;
              logger.error({
                message: 'Disconnected from RabbitMQ broker',
                error: err?.message,
                stack: err?.stack,
              });
            },
          },
        };
      },
    }),
  ],
  providers: [rabbitmqConnectionMetricProvider],
  exports: [RabbitMQModule, rabbitmqConnectionMetricProvider],
})
export class MessagingModule {}
