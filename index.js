const fs = require("fs");
const path = require("path");

// --- Constants ---
const TASKS_FILE = path.join(__dirname, "tasks.json");
const STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

// --- Utility Functions ---
const ensureTasksFile = () => {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, "[]", "utf8");
    return;
  }
  const content = fs.readFileSync(TASKS_FILE, "utf8");
  if (!content.trim()) {
    fs.writeFileSync(TASKS_FILE, "[]", "utf8");
    console.warn("Warning: tasks.json was empty. Resetting to empty list.");
  }
};

const loadTasks = () => {
  ensureTasksFile();
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
  } catch (e) {
    fs.writeFileSync(TASKS_FILE, "[]", "utf8");
    console.warn("Warning: tasks.json was invalid. Resetting to empty list.");
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
  } catch (e) {
    console.error("Error saving tasks file.");
    process.exit(1);
  }
};

const getNextTaskId = (tasks) =>
  tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;

const findTask = (tasks, id) => tasks.find((t) => t.id === id);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const nowDate = () => new Date().toISOString();

const printTask = (task) => {
  console.log(
    `[${task.id}] (${task.status}) ${task.description} | Created: ${formatDate(
      task.createdAt
    )} | Updated: ${formatDate(task.updatedAt)}`
  );
};

const showHelp = () => {
  console.log("Task Tracker CLI");
  console.log("Usage:");
  console.log("  add <description>                Add a new task");
  console.log("  update <id> <new description>    Update a task");
  console.log("  delete <id>                      Delete a task");
  console.log("  mark-in-progress <id>            Mark a task as in-progress");
  console.log("  mark-done <id>                   Mark a task as done");
  console.log("  list [all|todo|in-progress|done] List tasks");
};

// --- Command Handlers ---
const handleAdd = (tasks, args) => {
  const description = args.slice(1).join(" ").trim();
  if (!description) {
    console.log("Please provide a task description.");
    return false;
  }
  const now = nowDate();
  const newTask = {
    id: getNextTaskId(tasks),
    description,
    status: STATUS.TODO,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  console.log(`Task added successfully (ID: ${newTask.id})`);
  return true;
};

const handleUpdate = (tasks, args) => {
  const id = Number(args[1]);
  const newDescription = args.slice(2).join(" ").trim();
  if (!id || !newDescription) {
    console.log("Usage: update <id> <new description>");
    return false;
  }
  const task = findTask(tasks, id);
  if (!task) {
    console.log("Task not found.");
    return false;
  }
  task.description = newDescription;
  task.updatedAt = nowDate();
  console.log("Task updated successfully.");
  return true;
};

const handleDelete = (tasks, args) => {
  const id = Number(args[1]);
  if (!id) {
    console.log("Usage: delete <id>");
    return false;
  }
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    console.log("Task not found.");
    return false;
  }
  tasks.splice(idx, 1);
  console.log("Task deleted successfully.");
  return true;
};

const handleMarkStatus = (tasks, args, status, successMsg) => {
  const id = Number(args[1]);
  if (!id) {
    console.log(`Usage: mark-${status} <id>`);
    return false;
  }
  const task = findTask(tasks, id);
  if (!task) {
    console.log("Task not found.");
    return false;
  }
  task.status = status;
  task.updatedAt = nowDate();
  console.log(successMsg);
  return true;
};

const handleList = (tasks, args) => {
  const filter = (args[1] || "all").toLowerCase();
  let filteredTasks = tasks;
  if (filter === STATUS.TODO) filteredTasks = tasks.filter((t) => t.status === STATUS.TODO);
  else if (filter === STATUS.IN_PROGRESS) filteredTasks = tasks.filter((t) => t.status === STATUS.IN_PROGRESS);
  else if (filter === STATUS.DONE) filteredTasks = tasks.filter((t) => t.status === STATUS.DONE);
  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }
  filteredTasks.forEach(printTask);
};

// --- Main CLI Entrypoint ---
const main = () => {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "help") {
    showHelp();
    return;
  }
  const command = args[0];
  const tasks = loadTasks();
  let changed = false;
  switch (command) {
    case "add":
      changed = handleAdd(tasks, args);
      break;
    case "update":
      changed = handleUpdate(tasks, args);
      break;
    case "delete":
      changed = handleDelete(tasks, args);
      break;
    case "mark-in-progress":
      changed = handleMarkStatus(tasks, args, STATUS.IN_PROGRESS, "Task marked as in-progress.");
      break;
    case "mark-done":
      changed = handleMarkStatus(tasks, args, STATUS.DONE, "Task marked as done.");
      break;
    case "list":
      handleList(tasks, args);
      break;
    default:
      showHelp();
      break;
  }
  if (changed) saveTasks(tasks);
};

main();
