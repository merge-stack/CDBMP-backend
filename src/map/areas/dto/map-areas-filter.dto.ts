import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MapAreasFilterDto {
  @ApiPropertyOptional({ description: 'Filter by area name' })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({ description: 'Filter by intervention type' })
  @IsOptional()
  @IsString()
  intervention?: string;

  @ApiPropertyOptional({ description: 'Minimum budget value' })
  @IsOptional()
  budget_min?: number;

  @ApiPropertyOptional({ description: 'Maximum budget value' })
  @IsOptional()
  budget_max?: number;

  @ApiPropertyOptional({ description: 'Filter by Servizi Ecosistemici value' })
  @IsOptional()
  @IsString()
  servizi_ecosistemici?: string;

  @ApiPropertyOptional({ description: 'Filter by type' })
  @IsOptional()
  @IsString()
  layerType?: string;
}
