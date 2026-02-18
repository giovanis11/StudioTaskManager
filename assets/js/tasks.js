// ===== Studio Task Manager – Tasks Page =====
let currentFilter = "all";

const STORAGE_KEY = "stm_tasks_v1";
let tasks = [];

/* ---------------- Storage ---------------- */
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString();
}

/* ---------------- UI Helpers ---------------- */
function badgeClasses(status) {
  if (status === "completed")
    return "badge rounded-pill border fw-medium px-3 py-2 text-success border-success bg-success-subtle";
  if (status === "in-progress")
    return "badge rounded-pill border fw-medium px-3 py-2 text-primary border-primary bg-primary-subtle";
  return "badge rounded-pill border fw-medium px-3 py-2 text-warning border-warning bg-warning-subtle";
}

function priorityDotClass(priority) {
  if (priority === "high")   return "bg-danger";
  if (priority === "medium") return "bg-warning";
  return "bg-secondary";
}

/* ---------------- Modal Helpers ---------------- */
function openEditModal(task) {
  editTaskId.value      = task.id;
  editTitle.value       = task.title;
  editDescription.value = task.description;
  editDueDate.value     = task.dueDate;
  editStatus.value      = task.status;
  editPriority.value    = task.priority;
  editModal.classList.add("open");
}

function closeEditModal() {
  editModal.classList.remove("open");
}

function updateTaskSummary() {
  const totalEl     = document.querySelector("#totalTasks");
  const pendingEl   = document.querySelector("#pendingTasks");
  const completedEl = document.querySelector("#completedTasks");
  if (!totalEl || !pendingEl || !completedEl) return;

  const total     = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending   = total - completed;

  totalEl.textContent     = total;
  pendingEl.textContent   = pending;
  completedEl.textContent = completed;
}

/* ---------------- Render ---------------- */
function renderTasks() {
  updateTaskSummary();
  taskList.replaceChildren();

  let visibleTasks = tasks;
  if (currentFilter !== "all") {
    visibleTasks = tasks.filter(task => task.status === currentFilter);
  }

  if (visibleTasks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "border border-secondary-subtle rounded-4 p-4 small text-secondary bg-white text-center";
    const filterLabels = {
      all: "tasks",
      todo: "to-do tasks",
      "in-progress": "in-progress tasks",
      completed: "completed tasks"
    };
    empty.textContent = `No ${filterLabels[currentFilter]} found.`;
    taskList.appendChild(empty);
    return;
  }

  visibleTasks.forEach(task => {
    const card = document.createElement("article");
    card.className = "border border-secondary-subtle rounded-4 p-3 p-md-4 bg-white shadow-sm mb-3";

    // Top row: title + badge stacked on mobile, side by side on sm+
    const topRow = document.createElement("div");
    topRow.className = "d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2 mb-2";

    const title = document.createElement("h3");
    title.className = "fs-6 fw-semibold mb-0";
    title.textContent = task.title;

    const badge = document.createElement("span");
    badge.className = badgeClasses(task.status);
    badge.style.whiteSpace = "nowrap";
    badge.textContent = task.status.replace("-", " ").toUpperCase();

    topRow.append(title, badge);

    // Meta row: priority dot + due date
    const meta = document.createElement("div");
    meta.className = "d-flex align-items-center gap-2 small text-secondary mb-2 flex-wrap";

    const dot = document.createElement("span");
    dot.className = `rounded-circle ${priorityDotClass(task.priority)}`;
    dot.style.cssText = "width:10px; height:10px; display:inline-block; flex-shrink:0;";

    meta.append(
      dot,
      document.createTextNode(`Priority: ${task.priority}  •  Due: ${task.dueDate}`)
    );

    // Description
    const desc = document.createElement("p");
    desc.className = "small text-secondary mb-3";
    desc.textContent = task.description;

    // Buttons — full width on mobile, auto on sm+
    const btnRow = document.createElement("div");
    btnRow.className = "d-flex flex-column flex-sm-row gap-2";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "btn btn-outline-secondary btn-sm rounded-pill px-4";
    editBtn.onclick = () => openEditModal(task);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "btn btn-outline-danger btn-sm rounded-pill px-4";
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    btnRow.append(editBtn, delBtn);
    card.append(topRow, meta, desc, btnRow);
    taskList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const taskForm        = document.querySelector("#taskForm");
  const taskTitle       = document.querySelector("#taskTitle");
  const taskDescription = document.querySelector("#taskDescription");
  const taskDueDate     = document.querySelector("#taskDueDate");
  const taskStatus      = document.querySelector("#taskStatus");
  const taskPriority    =
    document.querySelector("#taskPriority") ||
    document.querySelector("#classPriority");

  window.taskList        = document.querySelector("#taskList");
  window.editModal       = document.querySelector("#editModal");
  window.editTaskForm    = document.querySelector("#editTaskForm");
  window.editTaskId      = document.querySelector("#editTaskId");
  window.editTitle       = document.querySelector("#editTitle");
  window.editDescription = document.querySelector("#editDescription");
  window.editDueDate     = document.querySelector("#editDueDate");
  window.editStatus      = document.querySelector("#editStatus");
  window.editPriority    = document.querySelector("#editPriority");
  window.cancelEdit      = document.querySelector("#cancelEdit");

  if (!taskForm) return;

  tasks = loadTasks();
  renderTasks();

  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    tasks.push({
      id:          generateId(),
      title:       taskTitle.value.trim(),
      description: taskDescription.value.trim(),
      dueDate:     taskDueDate.value,
      status:      taskStatus.value,
      priority:    taskPriority.value
    });
    saveTasks();
    renderTasks();
    taskForm.reset();
  });

  editTaskForm.addEventListener("submit", e => {
    e.preventDefault();
    const task = tasks.find(t => t.id === editTaskId.value);
    if (!task) return;
    task.title       = editTitle.value.trim();
    task.description = editDescription.value.trim();
    task.dueDate     = editDueDate.value;
    task.status      = editStatus.value;
    task.priority    = editPriority.value;
    saveTasks();
    renderTasks();
    closeEditModal();
  });

  cancelEdit.addEventListener("click", closeEditModal);

  const statusFilter = document.querySelector("#statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", e => {
      currentFilter = e.target.value;
      renderTasks();
    });
  }
});