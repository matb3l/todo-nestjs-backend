import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { TaskColumn } from 'src/column/task-column.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskColumn)
    private columnRepository: Repository<TaskColumn>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    user: User,
    columnId: number,
    title: string,
    description: string,
  ): Promise<Task> {
    const column = await this.columnRepository.findOne({
      where: { id: columnId, project: { user: { id: user.id } } },
    });

    if (!column) {
      throw new NotFoundException('Колонка не найдена');
    }

    const tasks = await this.taskRepository.find({
      where: { column: { id: columnId, project: { user: { id: user.id } } } },
    });

    const order = tasks.length + 1;

    const task = this.taskRepository.create({
      title,
      description,
      order,
      column,
    });
    return this.taskRepository.save(task);
  }

  async getTaskById(user: User, id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: id, column: { project: { user: { id: user.id } } } },
      relations: ['column'],
    });
    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }
    return task;
  }

  async getAllTasks(user: User, columnId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { column: { id: columnId, project: { user: { id: user.id } } } },
      order: { order: 'ASC' },
    });
    if (tasks.length === 0) {
      throw new NotFoundException('Задачи не найдены');
    }
    return tasks;
  }

  async updateTask(
    user: User,
    id: number,
    title: string,
    description: string,
  ): Promise<Task> {
    if (!title && !description) {
      throw new BadRequestException(
        'Необходимо указать хотя бы одно поле для обновления',
      );
    }
    const task = await this.getTaskById(user, id);
    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    return this.taskRepository.save(task);
  }

  async deleteTask(user: User, id: number): Promise<void> {
    const task = await this.getTaskById(user, id);
    const tasks = await this.getAllTasks(user, task.column.id);
    const order = task.order;

    const queryRunner =
      this.taskRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let t of tasks) {
        if (t.order > order) {
          t.order -= 1;
          await queryRunner.manager.save(t);
        }
      }
      await queryRunner.manager.remove(Task, task);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async reorderTask(user: User, id: number, order: number): Promise<void> {
    const task = await this.getTaskById(user, id);
    const tasks = await this.getAllTasks(user, task.column.id);
    const curOrder = task.order;

    if (order < 1) {
      order = 1;
    } else if (order > tasks.length) {
      order = tasks.length;
    }

    const queryRunner =
      this.taskRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let t of tasks) {
        if (order > curOrder && t.order > curOrder && t.order <= order) {
          t.order -= 1;
        } else if (order < curOrder && t.order < curOrder && t.order >= order) {
          t.order += 1;
        }
        await queryRunner.manager.save(t);
      }
      task.order = order;
      await queryRunner.manager.save(task);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async moveTaskToColumn(
    user: User,
    id: number,
    newColumnId: number,
    newOrder: number,
  ) {
    const task = await this.getTaskById(user, id);
    if (task.column.id === newColumnId) {
      throw new ConflictException();
    }
    const oldTasks = await this.getAllTasks(user, task.column.id);
    const newTasks = await this.getAllTasks(user, newColumnId);
    const newColumn = await this.columnRepository.findOne({
      where: { id: newColumnId, project: { user: { id: user.id } } },
      relations: ['tasks'],
    });
    const oldOrder = task.order;

    const queryRunner =
      this.taskRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let t of oldTasks) {
        if (t.order >= oldOrder) {
          t.order -= 1;
          await queryRunner.manager.save(t);
        }
      }

      for (let t of newTasks) {
        if (t.order >= newOrder) {
          t.order += 1;
          await queryRunner.manager.save(t);
        }
      }

      task.column = newColumn;
      task.order = newOrder;

      await queryRunner.manager.save(task);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
