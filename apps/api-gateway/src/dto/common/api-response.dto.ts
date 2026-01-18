import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ example: true, description: 'Request was successful' })
  success: true;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ example: 'Operation completed successfully', required: false })
  message?: string;
}

export class ErrorResponse {
  @ApiProperty({ example: false, description: 'Request failed' })
  success: false;

  @ApiProperty({
    description: 'Error details',
    example: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      details: [
        { field: 'mobile', message: 'Mobile number must be 10 digits' },
      ],
    },
  })
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export class PaginationMetadata {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Total items available' })
  total: number;

  @ApiProperty({ example: 10, description: 'Total pages' })
  totalPages: number;
}

export class PaginatedResponse<T> {
  @ApiProperty({ description: 'Array of items' })
  data: T[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMetadata })
  meta: PaginationMetadata;
}
