import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { Project } from './project/project.entity';
import { ColumnModule } from './column/column.module';
import { TaskModule } from './task/task.module';
import { RolesModule } from './roles/roles.module';
import { TaskColumn } from './column/task-column.entity';
import { Task } from './task/task.entity';
import { Role } from './roles/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'todo-db',
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '1111',
      database: process.env.POSTGRES_DB || 'todo_db',
      entities: [User, Project, TaskColumn, Task, Role],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    ColumnModule,
    TaskModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
