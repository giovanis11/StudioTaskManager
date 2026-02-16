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
    return "bg-green-50 text-green-700 border border-green-200";
  if (status === "in-progress")
    return "bg-blue-50 text-blue-700 border border-blue-200";
  return "bg-yellow-50 text-yellow-700 border border-yellow-200";
}

function priorityDot(priority) {
  if (priority === "high") return "bg-red-500";
  if (priority === "medium") return "bg-amber-500";
  return "bg-gray-400";
}

/* ---------------- Modal Helpers ---------------- */
function openEditModal(task) {
  editTaskId.value = task.id;
  editTitle.value = task.title;
  editDescription.value = task.description;
  editDueDate.value = task.dueDate;
  editStatus.value = task.status;
  editPriority.value = task.priority;

  editModal.classList.remove("hidden");
  editModal.classList.add("flex");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  editModal.classList.remove("flex");
}

function updateTaskSummary() {
  const totalEl = document.getElementById("totalTasks");
  const pendingEl = document.getElementById("pendingTasks");
  const completedEl = document.getElementById("completedTasks");

  if (!totalEl || !pendingEl || !completedEl) return;

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = total - completed;

  totalEl.textContent = total;
  pendingEl.textContent = pending;
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
    empty.className =
      "border border-gray-200 rounded-2xl p-6 text-sm text-gray-600 bg-white";

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

  // ✅ IMPORTANT: render ONLY visibleTasks
  visibleTasks.forEach(task => {
    const card = document.createElement("article");
    card.className = "border border-gray-200 rounded-2xl p-6 bg-white shadow-sm";

    const header = document.createElement("div");
    header.className = "flex justify-between gap-4 flex-wrap";

    const left = document.createElement("div");

    const title = document.createElement("h3");
    title.className = "text-lg font-semibold";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "flex items-center gap-3 mt-2 text-sm text-gray-600";

    const dot = document.createElement("span");
    dot.className = `w-2.5 h-2.5 rounded-full ${priorityDot(task.priority)}`;

    meta.append(
      dot,
      document.createTextNode(` Priority: ${task.priority}`),
      document.createTextNode(` • Due: ${task.dueDate}`)
    );

    left.append(title, meta);

    const right = document.createElement("div");
    right.className = "flex items-center gap-3";

    const badge = document.createElement("span");
    badge.className =
      `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClasses(task.status)}`;
    badge.textContent = task.status.replace("-", " ").toUpperCase();

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className =
      "rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50";
    editBtn.onclick = () => openEditModal(task);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className =
      "rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50";
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    right.append(badge, editBtn, delBtn);

    const desc = document.createElement("p");
    desc.className = "text-sm text-gray-600 mt-4";
    desc.textContent = task.description;

    header.append(left, right);
    card.append(header, desc);
    taskList.appendChild(card);
  });
}


/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  // FORM
  const taskForm = document.getElementById("taskForm");
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const taskDueDate = document.getElementById("taskDueDate");
  const taskStatus = document.getElementById("taskStatus");
  const taskPriority =
    document.getElementById("taskPriority") ||
    document.getElementById("classPriority");

  // LIST
  window.taskList = document.getElementById("taskList");

  // EDIT MODAL ELEMENTS
  window.editModal = document.getElementById("editModal");
  window.editTaskForm = document.getElementById("editTaskForm");
  window.editTaskId = document.getElementById("editTaskId");
  window.editTitle = document.getElementById("editTitle");
  window.editDescription = document.getElementById("editDescription");
  window.editDueDate = document.getElementById("editDueDate");
  window.editStatus = document.getElementById("editStatus");
  window.editPriority = document.getElementById("editPriority");
  window.cancelEdit = document.getElementById("cancelEdit");

  // SAFETY CHECK
  if (!taskForm) return;

  tasks = loadTasks();
  renderTasks();

  taskForm.addEventListener("submit", e => {
    e.preventDefault();

    tasks.push({
      id: generateId(),
      title: taskTitle.value.trim(),
      description: taskDescription.value.trim(),
      dueDate: taskDueDate.value,
      status: taskStatus.value,
      priority: taskPriority.value
    });

    saveTasks();
    renderTasks();
    taskForm.reset();
  });

  editTaskForm.addEventListener("submit", e => {
    e.preventDefault();

    const task = tasks.find(t => t.id === editTaskId.value);
    if (!task) return;

    task.title = editTitle.value.trim();
    task.description = editDescription.value.trim();
    task.dueDate = editDueDate.value;
    task.status = editStatus.value;
    task.priority = editPriority.value;

    saveTasks();
    renderTasks();
    closeEditModal();
  });

  cancelEdit.addEventListener("click", closeEditModal);

  const statusFilter = document.getElementById("statusFilter");

if (statusFilter) {
  statusFilter.addEventListener("change", e => {
    currentFilter = e.target.value;
    renderTasks();
  });
}

});
