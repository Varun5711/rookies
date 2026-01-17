import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@dpi/database';

export enum Season {
  KHARIF = 'kharif',
  RABI = 'rabi',
  ZAID = 'zaid',
  ALL = 'all',
}

export enum AdvisoryCategory {
  PEST_CONTROL = 'pest_control',
  WEATHER = 'weather',
  IRRIGATION = 'irrigation',
  FERTILIZER = 'fertilizer',
  HARVESTING = 'harvesting',
  SOWING = 'sowing',
  GENERAL = 'general',
}

@Entity('advisories')
export class Advisory extends BaseEntity {
  @Column()
  title: string;

  @Column({ name: 'crop_name' })
  cropName: string;

  @Column({
    type: 'enum',
    enum: Season,
    default: Season.ALL,
  })
  season: Season;

  @Column({
    type: 'enum',
    enum: AdvisoryCategory,
    default: AdvisoryCategory.GENERAL,
  })
  category: AdvisoryCategory;

  @Column()
  state: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ type: 'text' })
  advisory: string;

  @Column({ type: 'simple-array', nullable: true, name: 'crop_types' })
  cropTypes?: string[];

  @Column({ nullable: true, name: 'published_by' })
  publishedBy?: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true, name: 'valid_from' })
  validFrom?: Date;

  @Column({ nullable: true, name: 'valid_until' })
  validUntil?: Date;
}
