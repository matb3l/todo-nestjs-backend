import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'New Task Title',
    description: 'Новое название задачи',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'New Task Description',
    description: 'Новое описание задачи',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
