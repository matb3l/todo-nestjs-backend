import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';
import { MoveToColumnTaskDto } from './dto/move-to-column-task.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@ApiTags('Задачи')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}
  @ApiOperation({ summary: 'Создание новой задачи' })
  @ApiResponse({ status: 201, description: 'Задача успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена.' })
  @Roles('USER')
  @Post()
  async createTask(@Req() req, @Body() CreateTaskDto: CreateTaskDto) {
    return await this.taskService.createTask(
      req.user,
      CreateTaskDto.columnId,
      CreateTaskDto.title,
      CreateTaskDto.description,
    );
  }

  @ApiOperation({ summary: 'Получение задачи по ID' })
  @ApiResponse({ status: 200, description: 'Задача успешно получена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @Roles('USER')
  @Get(':id')
  async getTaskById(@Req() req, @Param('id') id: number) {
    return await this.taskService.getTaskById(req.user, id);
  }

  @ApiOperation({ summary: 'Получение всех задач' })
  @ApiResponse({ status: 200, description: 'Задачи успешно получены.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задачи не найдена.' })
  @ApiParam({
    name: 'columnId',
    type: Number,
    description: 'ID колонки',
    required: true,
    example: 1,
  })
  @Roles('USER')
  @Get('column/:columnId')
  async getAllTasks(@Req() req, @Param('columnId') columnId: number) {
    return await this.taskService.getAllTasks(req.user, columnId);
  }

  @ApiOperation({ summary: 'Обновление задачи' })
  @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID задачи',
  })
  @Roles('USER')
  @Patch(':id')
  async updateTask(
    @Req() req,
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(
      req.user,
      id,
      updateTaskDto.title,
      updateTaskDto.description,
    );
  }

  @ApiOperation({ summary: 'Изменение порядкового номера задачи по ID' })
  @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @Roles('USER')
  @Patch(':id/reorder')
  async reorderTask(
    @Req() req,
    @Param('id') id: number,
    @Body() reorderTaskDto: ReorderTaskDto,
  ) {
    const user = req.user;
    await this.taskService.reorderTask(user, id, reorderTaskDto.order);
    return { message: 'Номер позиции успешно изменен' };
  }

  @ApiOperation({ summary: 'Перемещение задачи между колонками' })
  @ApiResponse({ status: 200, description: 'Задача успешно обновлена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    description: 'ID задачи',
  })
  @Roles('USER')
  @Patch(':id/move-to-column')
  async moveToColumnTask(
    @Req() req,
    @Param('id') id: number,
    @Body() moveToColumnTaskDto: MoveToColumnTaskDto,
  ) {
    await this.taskService.moveTaskToColumn(
      req.user,
      id,
      moveToColumnTaskDto.newColumnId,
      moveToColumnTaskDto.newOrder,
    );
    return { message: 'Изменения успешно внесены' };
  }

  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiResponse({ status: 200, description: 'Задача успешно удалена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Задача не найдена.' })
  @ApiResponse({ status: 409, description: 'ID колонок совпадают.' })
  @Roles('USER')
  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID задачи',
  })
  async deleteTask(@Req() req, @Param('id') id: number) {
    const user = req.user;
    await this.taskService.deleteTask(user, id);
    return { message: 'Задача удалена' };
  }
}
