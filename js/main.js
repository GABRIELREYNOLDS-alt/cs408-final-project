import { getTasks, saveTask, deleteTask } from "./awsClient.js";

// Load and display tasks
async function loadTasks() {
  const tasks = await getTasks();
  console.log(tasks);
  // render to your table...
}

// Add new task
async function handleAddTask() {
  const task = {
    id: crypto.randomUUID(),
    title: "Finish assignment",
    dueDate: "2025-05-01",
    priority: "High",
    status: "Incomplete",
  };
  await saveTask(task);
  loadTasks();
}

// Delete a task
async function handleDeleteTask(id) {
  await deleteTask(id);
  loadTasks();
}
