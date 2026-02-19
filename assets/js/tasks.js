// ===== Studio Task Manager – Production Version =====

let currentFilter = "all";
let currentSearch = "";

const STORAGE_KEY = "stm_tasks_v3";
const DESCRIPTION_CHAR_LIMIT = 180;

let tasks = [];

/// storage
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function generateId() {
  return crypto.randomUUID();
}

/* ---------------- Helpers ---------------- */
function badgeClasses(status) {
  if (status === "completed")
    return "badge rounded-pill border fw-medium px-3 py-2 text-success border-success bg-success-subtle";
  if (status === "in-progress")
    return "badge rounded-pill border fw-medium px-3 py-2 text-primary border-primary bg-primary-subtle";
  return "badge rounded-pill border fw-medium px-3 py-2 text-warning border-warning bg-warning-subtle";
}

function priorityDotClass(priority) {
  if (priority === "high") return "bg-danger";
  if (priority === "medium") return "bg-warning";
  return "bg-secondary";
}

function truncateDescription(text) {
  const clean = (text ?? "").trim();

  if (clean.length <= DESCRIPTION_CHAR_LIMIT) {
    return { shortText: clean, truncated: false };
  }

  return {
    shortText: clean.slice(0, DESCRIPTION_CHAR_LIMIT) + "...",
    truncated: true
  };
}

function isOverdue(task) {
  if (!task.dueDate || task.status === "completed") return false;
  return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
}

/* ---------------- Summary ---------------- */
function updateTaskSummary() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = total - completed;

  document.querySelector("#totalTasks").textContent = total;
  document.querySelector("#pendingTasks").textContent = pending;
  document.querySelector("#completedTasks").textContent = completed;
}

/* ---------------- Render ---------------- */
function renderTasks() {
  updateTaskSummary();
  taskList.replaceChildren();

  let visibleTasks = [...tasks];

  // Sort by due date
  visibleTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Filter by status
  if (currentFilter !== "all") {
    visibleTasks = visibleTasks.filter(task => task.status === currentFilter);
  }

  // Search
  if (currentSearch.trim() !== "") {
    visibleTasks = visibleTasks.filter(task =>
      task.title.toLowerCase().includes(currentSearch) ||
      task.description.toLowerCase().includes(currentSearch)
    );
  }

  if (visibleTasks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "border border-secondary-subtle rounded-4 p-4 small text-secondary bg-white text-center";
    empty.textContent = "No tasks found.";
    taskList.appendChild(empty);
    return;
  }

  visibleTasks.forEach(task => {

    const card = document.createElement("article");
    card.className = "border border-secondary-subtle rounded-4 p-3 p-md-4 bg-white shadow-sm mb-3";

    if (isOverdue(task)) {
      card.classList.add("border-danger");
    }

    /* ---------- Top Row ---------- */
    const topRow = document.createElement("div");
    topRow.className = "d-flex flex-column flex-sm-row justify-content-between align-items-start gap-2 mb-2";

    const title = document.createElement("h3");
    title.className = "fs-6 fw-semibold mb-0";
    title.textContent = task.title;

    const badge = document.createElement("span");
    badge.className = badgeClasses(task.status);
    badge.textContent = task.status.replace("-", " ").toUpperCase();

    topRow.append(title, badge);

    /* ---------- Meta ---------- */
    const meta = document.createElement("div");
    meta.className = "d-flex align-items-center gap-2 small text-secondary mb-2 flex-wrap";

    const dot = document.createElement("span");
    dot.className = `rounded-circle ${priorityDotClass(task.priority)}`;
    dot.style.cssText = "width:10px; height:10px; display:inline-block;";

    meta.append(dot);
    meta.append(document.createTextNode(`Priority: ${task.priority} • Due: ${task.dueDate}`));

    /* ---------- Description ---------- */
    const descWrapper = document.createElement("div");
    descWrapper.className = "small text-secondary mb-3";

    const { shortText, truncated } = truncateDescription(task.description);

    const descText = document.createElement("div");
    descText.className = "task-description";
    descText.textContent = shortText;

    descWrapper.appendChild(descText);

    if (truncated) {
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "btn btn-link p-0 small";
      toggleBtn.textContent = "Read more";

      toggleBtn.addEventListener("click", () => {
        const expanded = descText.classList.toggle("expanded");

        descText.textContent = expanded
          ? task.description
          : shortText;

        toggleBtn.textContent = expanded
          ? "Show less"
          : "Read more";
      });

      descWrapper.appendChild(toggleBtn);
    }

    /* ---------- Buttons ---------- */
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
      if (!confirm("Are you sure you want to delete this task?")) return;
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    btnRow.append(editBtn, delBtn);

    card.append(topRow, meta, descWrapper, btnRow);
    taskList.appendChild(card);
  });
}

/* ---------------- Modal ---------------- */
function openEditModal(task) {
  editTaskId.value = task.id;
  editTitle.value = task.title;
  editDescription.value = task.description;
  editDueDate.value = task.dueDate;
  editStatus.value = task.status;
  editPriority.value = task.priority;
  editModal.classList.add("open");
}

function closeEditModal() {
  editModal.classList.remove("open");
}

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {

  tasks = loadTasks();

  window.taskList = document.querySelector("#taskList");
  window.taskForm = document.querySelector("#taskForm");
  window.taskTitle = document.querySelector("#taskTitle");
  window.taskDescription = document.querySelector("#taskDescription");
  window.taskDueDate = document.querySelector("#taskDueDate");
  window.taskStatus = document.querySelector("#taskStatus");
  window.taskPriority =
    document.querySelector("#taskPriority") ||
    document.querySelector("#classPriority");

  window.editModal = document.querySelector("#editModal");
  window.editTaskForm = document.querySelector("#editTaskForm");
  window.editTaskId = document.querySelector("#editTaskId");
  window.editTitle = document.querySelector("#editTitle");
  window.editDescription = document.querySelector("#editDescription");
  window.editDueDate = document.querySelector("#editDueDate");
  window.editStatus = document.querySelector("#editStatus");
  window.editPriority = document.querySelector("#editPriority");
  window.cancelEdit = document.querySelector("#cancelEdit");

  const statusFilter = document.querySelector("#statusFilter");
  const taskSearch = document.querySelector("#taskSearch");

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

  editModal.addEventListener("click", e => {
    if (e.target === editModal) closeEditModal();
  });

  statusFilter.addEventListener("change", e => {
    currentFilter = e.target.value;
    renderTasks();
  });

  taskSearch.addEventListener("input", e => {
    currentSearch = e.target.value.toLowerCase();
    renderTasks();
  });

});
