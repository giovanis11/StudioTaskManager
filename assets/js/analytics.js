const STORAGE_KEY = "stm_tasks_v3";

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function calculateAnalytics(tasks) {

  const status = {
    completed: 0,
    pending: 0
  };

  const priority = {
    high: 0,
    medium: 0,
    low: 0
  };

  tasks.forEach(task => {

    // status
    if (task.status === "completed") {
      status.completed++;
    } else {
      status.pending++;
    }

    // priority
    if (priority[task.priority] !== undefined) {
      priority[task.priority]++;
    }

  });

  return { status, priority };
}
function createStatusChart(data) {

  const ctx = document.getElementById("statusChart");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [
          data.completed,
          data.pending
        ]
      }]
    }
  });
}
function createPriorityChart(data) {

  const ctx = document.getElementById("priorityChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["High", "Medium", "Low"],
      datasets: [{
        data: [
          data.high,
          data.medium,
          data.low
        ]
      }]
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {

  const tasks = loadTasks();
  console.log("Analytics loaded tasks:", tasks);

  const analytics = calculateAnalytics(tasks);

  updateMetrics(tasks); 

  createStatusChart(analytics.status);
  createPriorityChart(analytics.priority);

});


//top shit 
function updateMetrics(tasks) {

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = total - completed;

  const completionRate = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  document.getElementById("metricTotal").textContent = total;
  document.getElementById("metricCompleted").textContent = completed;
  document.getElementById("metricPending").textContent = pending;
  document.getElementById("metricRate").textContent = completionRate + "%";
}

