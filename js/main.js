const form = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const pendingCount = document.querySelector("#pending-count");
const errorMessage = document.querySelector("#error-message");

let tasks = [];

/*
  Cascada / lógica:
  - El estado real vive en el array tasks.
  - Cada vez que cambia algo, se vuelve a renderizar el DOM completo.
  - Así evitamos inconsistencias entre la UI y los datos.
*/

const updatePendingCount = () => {
  const pendingTasks = tasks.filter((task) => !task.completed);
  pendingCount.textContent = pendingTasks.length;
};

const showError = (message) => {
  errorMessage.textContent = message;
};

const clearError = () => {
  errorMessage.textContent = "";
};

const createTaskElement = (task) => {
  const li = document.createElement("li");
  li.classList.add("todo__item");

  const taskText = document.createElement("p");
  taskText.classList.add("todo__task");
  taskText.textContent = task.text;

  if (task.completed) {
    taskText.classList.add("completed");
  }

  const actions = document.createElement("div");
  actions.classList.add("todo__actions");

  const completeButton = document.createElement("button");
  completeButton.classList.add("todo__action-btn", "todo__action-btn--complete");
  completeButton.textContent = task.completed ? "Desmarcar" : "Completar";

  completeButton.addEventListener("click", () => {
    toggleTask(task.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("todo__action-btn", "todo__action-btn--delete");
  deleteButton.textContent = "Eliminar";

  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
  });

  actions.append(completeButton, deleteButton);
  li.append(taskText, actions);

  return li;
};

const renderTasks = () => {
  taskList.textContent = "";

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("todo__empty");
    emptyMessage.textContent = "No hay tareas todavía.";
    taskList.append(emptyMessage);
  } else {
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      taskList.append(taskElement);
    });
  }

  updatePendingCount();
};

const addTask = (text) => {
  const newTask = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  renderTasks();
};

const toggleTask = (id) => {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  renderTasks();
};

const deleteTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = taskInput.value.trim();

  if (taskText === "") {
    showError("No puedes agregar una tarea vacía.");
    return;
  }

  clearError();
  addTask(taskText);
  taskInput.value = "";
  taskInput.focus();
});

renderTasks();