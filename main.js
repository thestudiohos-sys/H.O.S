// Add JS hereconst STORAGE_KEY = "hos-tasks";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const taskCountEl = document.getElementById("taskCount");

// localStorage에서 할 일 목록 불러오기
function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

// localStorage에 할 일 목록 저장
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  updateCount(tasks.length);
}

// 개수 표시 업데이트
function updateCount(count) {
  taskCountEl.textContent = count;
}

// 단일 항목 DOM 생성
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;
  if (task.done) li.classList.add("done");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", "완료 표시");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "삭제";
  deleteBtn.setAttribute("aria-label", "항목 삭제");

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// 목록 전체 렌더링
function renderTasks(tasks) {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";
  
  const pendingTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);
  
  pendingTasks.forEach((task) => {
    const el = createTaskElement(task);
    pendingList.appendChild(el);
  });
  
  completedTasks.forEach((task) => {
    const el = createTaskElement(task);
    completedList.appendChild(el);
  });
  
  updateCount(tasks.length);
}

// 할 일 추가
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const tasks = loadTasks();
  const newTask = {
    id: Date.now().toString(),
    text,
    done: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(tasks);
  taskInput.value = "";
  taskInput.focus();
}

// 완료 토글
function toggleDone(id) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks(tasks);
  renderTasks(tasks);
}

// 할 일 삭제
function deleteTask(id) {
  const tasks = loadTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
  renderTasks(tasks);
}

// 이벤트 위임: 목록 클릭 처리
pendingList.addEventListener("click", (e) => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.classList.contains("task-checkbox")) {
    toggleDone(id);
  } else if (e.target.classList.contains("task-delete")) {
    deleteTask(id);
  }
});

completedList.addEventListener("click", (e) => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.classList.contains("task-checkbox")) {
    toggleDone(id);
  } else if (e.target.classList.contains("task-delete")) {
    deleteTask(id);
  }
});

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// 앱 시작 시 저장된 목록 불러와서 렌더링
const initialTasks = loadTasks();
renderTasks(initialTasks);
