import { Hospital } from '../entities/hospital.entity';

/**
 * Hospital Response DTO
 * Used for API responses to format hospital data
 */
export class HospitalDto {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  facilities: string[];
  isActive: boolean;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Convert Hospital entity to DTO
   */
  static fromEntity(hospital: Hospital): HospitalDto {
    const dto = new HospitalDto();
    dto.id = hospital.id;
    dto.name = hospital.name;
    dto.city = hospital.city;
    dto.state = hospital.state;
    dto.pincode = hospital.pincode;
    dto.facilities = hospital.facilities;
    dto.isActive = hospital.isActive;
    dto.address = hospital.address;
    dto.phone = hospital.phone;
    dto.email = hospital.email;
    dto.createdAt = hospital.createdAt;
    dto.updatedAt = hospital.updatedAt;
    return dto;
  }
}

/**
 * Paginated Hospital Response
 */
export class PaginatedHospitalsDto {
  data: HospitalDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
