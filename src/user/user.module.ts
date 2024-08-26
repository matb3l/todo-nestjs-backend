import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RolesModule)],
  controllers: [],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
