import { ConsumerConfig, ProducerConfig } from 'kafkajs';

export interface KafkaConfig {
  /**
   * @default 'KAFKA_SERVICE'
   */
  name?: string;

  /**
   * @example 'auth-svc', 'api-gateway', 'notification-svc'
   */
  clientId: string;

  /**
   * @default ['localhost:9092']
   */
  brokers?: string[];

  /**
   * Consumer group ID (required for consumers)
   * @example 'auth-svc-consumer-group'
   */
  consumerGroupId?: string;
  producer?: Partial<ProducerConfig>;
  consumer?: Partial<ConsumerConfig>;
}