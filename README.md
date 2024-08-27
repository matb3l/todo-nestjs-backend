# Todo List (NestJS Backend)

## Описание

Проект включает в себя бэкенд для приложения Todo List, реализованный с использованием NestJS и TypeORM. Он предоставляет API для управления задачами и проектами, а также включает функциональность аутентификации и управления ролями. В проекте используется Docker для контейнеризации как приложения, так и базы данных.

## Установка и запуск

1. **Клонируйте репозиторий**

    ```bash
    git clone https://github.com/dddurnov/todo-nestjs-backend.git
    ```
    ```bash
    cd todo-nestjs-backend
    ```

2. **Создайте файл `.env`**

    В корневой директории проекта создайте файл `.env` и добавьте в него следующие переменные окружения:

    ```env
    DATABASE_HOST=todo-db
    DATABASE_PORT=5432
    DATABASE_USERNAME=postgres
    DATABASE_PASSWORD=1111
    DATABASE_NAME=todo_service

    JWT_SECRET=your_jwt_secret
    ```

3. **Запустите Docker Compose**

    Убедитесь, что у вас установлены Docker и Docker Compose. Затем выполните команду:

    ```bash
    docker-compose up --build
    ```

    Эта команда создаст и запустит контейнеры для приложения и базы данных. База данных PostgreSQL будет доступна в контейнере `todo-db`, а API сервиса будет доступен на порту 3000 (по умолчанию).

4. **Проверьте доступность**

    - **API сервиса Todo List**: [http://localhost:3000](http://localhost:3000)
    - **Swagger API Documentation** (если включено): [http://localhost:3000/api](http://localhost:3000/api)

## Остановка

Для остановки контейнеров выполните команду:

```bash
docker-compose down
