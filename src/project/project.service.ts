import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async createProject(
    user: User,
    title: string,
    description: string,
  ): Promise<Project> {
    const project = this.projectRepository.create({ title, description, user });
    return await this.projectRepository.save(project);
  }

  async getProjectById(user: User, id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['columns', 'columns.tasks'],
    });
    if (!project) {
      throw new NotFoundException('Проект не найден');
    }
    return project;
  }

  async getAllProjects(user: User): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { user: { id: user.id } },
      relations: ['columns', 'columns.tasks'],
    });
  }

  async updateProject(
    user: User,
    id: number,
    title: string,
    description: string,
  ): Promise<Project> {
    if (!title && !description) {
      throw new BadRequestException(
        'Необходимо указать хотя бы одно поле для обновления',
      );
    }
    const project = await this.getProjectById(user, id);
    if (title) {
      project.title = title;
    }
    if (description) {
      project.description = description;
    }
    return await this.projectRepository.save(project);
  }

  async deleteProject(user: User, id: number): Promise<void> {
    const project = await this.getProjectById(user, id);
    await this.projectRepository.remove(project);
  }
}
