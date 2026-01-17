import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaConfig } from './interfaces/kafka-config.interface';

@Global()
@Module({})
export class KafkaModule {

  static register(config: KafkaConfig): DynamicModule {
    const serviceName = config.name || 'KAFKA_SERVICE';
    return {
      module: KafkaModule,
      global: true,
      imports: [
        ClientsModule.register([
          {
            name: serviceName,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: config.clientId,
                brokers: config.brokers || ['localhost:9092'],
              },
              producer: {
                allowAutoTopicCreation: true,
                ...config.producer,
              },
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
  static getConsumerOptions(config: KafkaConfig) {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: config.clientId,
          brokers: config.brokers || ['localhost:9092'],
        },
        consumer: {
          groupId: config.consumerGroupId,
          allowAutoTopicCreation: true,
          ...config.consumer,
        },
      },
    };
  }
}