# Task Tracker CLI

---
> This project is based on the [Task Tracker CLI project from roadmap.sh](https://roadmap.sh/projects/task-tracker).
---

## Features

- **Add** new tasks
- **Update** existing tasks
- **Delete** tasks
- **Mark** tasks as in-progress or done
- **List** all tasks or filter by status (`todo`, `in-progress`, `done`)
- All tasks are stored in a local `tasks.json` file

## Requirements

- Node.js

## Usage

Run the CLI using Node.js:

```sh
node index.js <command> [arguments]
```

### Commands

- **Add a new task**
  ```sh
  node index.js add "Buy groceries"
  # Output: Task added successfully (ID: 1)
  ```

- **Update a task**
  ```sh
  node index.js update 1 "Buy groceries and cook dinner"
  # Output: Task updated successfully.
  ```

- **Delete a task**
  ```sh
  node index.js delete 1
  # Output: Task deleted successfully.
  ```

- **Mark a task as in-progress**
  ```sh
  node index.js mark-in-progress 1
  # Output: Task marked as in-progress.
  ```

- **Mark a task as done**
  ```sh
  node index.js mark-done 1
  # Output: Task marked as done.
  ```

- **List all tasks**
  ```sh
  node index.js list
  ```

- **List tasks by status**
  ```sh
  node index.js list todo
  node index.js list in-progress
  node index.js list done
  ```

- **Show help**
  ```sh
  node index.js help
  ```

## Task Properties

Each task in `tasks.json` has the following properties:

- `id`: Unique identifier for the task
- `description`: Short description of the task
- `status`: One of `todo`, `in-progress`, or `done`
- `createdAt`: Date and time when the task was created (ISO format)
- `updatedAt`: Date and time when the task was last updated (ISO format)

## Example

```sh
node index.js add "Read a book"
node index.js list
node index.js mark-in-progress 1
node index.js mark-done 1
node index.js list done
```