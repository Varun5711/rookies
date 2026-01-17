import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@dpi/database';

/**
 * Registered Service Entity
 * Stores metadata about all services registered in the DPI platform
 *
 * This is the core of dynamic service discovery:
 * - Services register themselves on startup
 * - API Gateway queries this to resolve routes
 * - Health checker monitors service status
 */
@Entity('registered_services')
export class RegisteredService extends BaseEntity {
  // === Identity ===
  @Column({ unique: true })
  name: string; // Unique service identifier: "healthcare", "agriculture", "urban"

  @Column({ name: 'display_name' })
  displayName: string; // Human-readable name: "Healthcare Services"

  @Column('text')
  description: string; // Service description

  // === Connectivity ===
  @Column({ name: 'base_url' })
  baseUrl: string; // Service base URL: "http://healthcare-svc:3010"

  @Column({ name: 'health_endpoint', default: '/health' })
  healthEndpoint: string; // Health check endpoint

  // === Status ===
  @Column({
    type: 'varchar',
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'; // Operational status

  @Column({
    type: 'varchar',
    default: 'HEALTHY',
    name: 'health_status',
  })
  healthStatus: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED'; // Health check result

  @Column({ nullable: true, name: 'last_health_check' })
  lastHealthCheck?: Date;

  // === Metadata ===
  @Column()
  version: string; // Service version: "1.0.0"

  @Column()
  owner: string; // Owning department: "health-ministry"

  @Column({ type: 'simple-array', default: '' })
  tags: string[]; // Tags for categorization: ["healthcare", "appointments"]

  @Column({ nullable: true, name: 'api_docs_url' })
  apiDocsUrl?: string; // Swagger/OpenAPI documentation URL

  // === Access Control ===
  @Column({ default: false, name: 'is_public' })
  isPublic: boolean; // Can unauthenticated users access?

  @Column({ type: 'simple-array', default: '', name: 'required_roles' })
  requiredRoles: string[]; // Minimum roles required to access

  // === Registration Metadata ===
  @Column({ nullable: true, name: 'registered_by' })
  registeredBy?: string; // User who registered the service
}
