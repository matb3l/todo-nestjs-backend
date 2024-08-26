import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProjectDto } from 'src/project/dto/create-project.dto';
import { UpdateProjectDto } from 'src/project/dto/update-project.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@ApiBearerAuth('access-token')
@ApiTags('Проекты')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Создание проекта' })
  @ApiResponse({ status: 201, description: 'Проект создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Post()
  @Roles('USER')
  async createProject(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    return await this.projectService.createProject(
      req.user,
      createProjectDto.title,
      createProjectDto.description,
    );
  }

  @ApiOperation({ summary: 'Получение всех проектов пользователя' })
  @ApiResponse({ status: 200, description: 'Проекты получены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проекты не найдены' })
  @Roles('USER')
  @Get()
  async getProjects(@Req() req) {
    return await this.projectService.getAllProjects(req.user);
  }

  @ApiOperation({ summary: 'Получение проекта по ID' })
  @ApiResponse({ status: 200, description: 'Проект получен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID проекта',
  })
  @Roles('USER')
  @Get(':id')
  async getProjectById(@Req() req, @Param('id') id: number) {
    return await this.projectService.getProjectById(req.user, id);
  }

  @ApiOperation({ summary: 'Изменение проекта по ID' })
  @ApiResponse({ status: 200, description: 'Проект изменен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID проекта',
  })
  @Roles('USER')
  @Patch(':id')
  async updateProject(
    @Req() req,
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: number,
  ) {
    return await this.projectService.updateProject(
      req.user,
      id,
      updateProjectDto.title,
      updateProjectDto.description,
    );
  }

  @ApiOperation({ summary: 'Удаление проекта по ID' })
  @ApiResponse({ status: 200, description: 'Проект удален' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Проект не найден' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID проекта',
  })
  @Roles('USER')
  @Delete(':id')
  async deleteProject(@Req() req, @Param('id') id: number) {
    await this.projectService.deleteProject(req.user, id);
    return { message: 'Проект удален' };
  }
}
