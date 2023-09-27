import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
} from 'class-validator';

class GeoCodingDto {
  @ApiProperty()
  @IsOptional()
  @IsLatitude()
  latitude?: string;

  @ApiProperty()
  @IsOptional()
  @IsLongitude()
  longitude?: string;

  
  @ApiProperty()
  @IsOptional()
  @IsString()
  city?: string;
}

export { GeoCodingDto };
