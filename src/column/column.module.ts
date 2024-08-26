import { Module } from '@nestjs/common';
import { ColumnController } from './column.controller';
import { ColumnService } from './column.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskColumn } from './task-column.entity';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaskColumn]), ProjectModule, UserModule],
  controllers: [ColumnController],
  providers: [ColumnService],
  exports: [ColumnService, TypeOrmModule],
})
export class ColumnModule {}
