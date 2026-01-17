import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@dpi/database';

export enum CommodityCategory {
  CEREALS = 'cereals',
  PULSES = 'pulses',
  OILSEEDS = 'oilseeds',
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  SPICES = 'spices',
  FIBERS = 'fibers',
  OTHER = 'other',
}

@Entity('commodity_prices')
export class CommodityPrice extends BaseEntity {
  @Column()
  commodity: string;

  @Column({
    type: 'enum',
    enum: CommodityCategory,
    default: CommodityCategory.CEREALS,
  })
  category: CommodityCategory;

  @Column()
  mandi: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'min_price' })
  minPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'max_price' })
  maxPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'modal_price' })
  modalPrice?: number;

  @Column({ type: 'date', name: 'price_date' })
  priceDate: Date;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: 'int', nullable: true, name: 'arrivals_tonnes' })
  arrivalsTonnes?: number;
}
