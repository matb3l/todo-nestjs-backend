import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), UserModule],
  exports: [ProjectService, TypeOrmModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
