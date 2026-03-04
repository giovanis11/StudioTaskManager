const CONTACT_STORAGE_KEY = "stm_contact_submissions_v1";

function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function renderSubmissions() {
  const body = document.querySelector("#submissionsBody");
  const emptyMessage = document.querySelector("#emptyMessage");
  const submissions = getSubmissions();

  if (!body || !emptyMessage) return;

  body.innerHTML = "";

  if (submissions.length === 0) {
    emptyMessage.classList.remove("d-none");
    return;
  }

  emptyMessage.classList.add("d-none");

  submissions.forEach((item, index) => {
    const row = document.createElement("tr");

    const indexCell = document.createElement("td");
    indexCell.textContent = String(index + 1);

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(item.createdAt).toLocaleString();

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name || "";

    const emailCell = document.createElement("td");
    emailCell.textContent = item.email || "";

    const messageCell = document.createElement("td");
    messageCell.textContent = item.message || "";

    row.append(indexCell, dateCell, nameCell, emailCell, messageCell);
    body.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSubmissions();

  const clearBtn = document.querySelector("#clearSubmissionsBtn");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(CONTACT_STORAGE_KEY);
    renderSubmissions();
  });
});
