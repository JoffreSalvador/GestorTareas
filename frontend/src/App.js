import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks from backend on component mount
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Function to add a task
  const addTask = () => {
    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status: "To Do" }),
    }).then(() => window.location.reload());
  };

  // Function to update task status
  const changeStatus = (id, newStatus) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(() => {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    });
  };

  // Function to delete a task
  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  // Group tasks by status
  const groupedTasks = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    "Completed": tasks.filter((task) => task.status === "Completed"),
  };

  // Handle the drag and drop functionality
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return; // If dropped outside any column

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    // If the task is dropped in the same column, do nothing
    if (sourceColumn === destinationColumn) return;

    const movedTaskId = groupedTasks[sourceColumn][source.index].id;
    const newStatus = destinationColumn;

    // Update the task's status on the backend
    changeStatus(movedTaskId, newStatus);

    // Update local state to reflect the change
    const updatedTasks = tasks.map((task) =>
      task.id === movedTaskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="board">
      <h1>Task Manager</h1>
      <div className="inputs">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          {["To Do", "In Progress", "Completed"].map((column) => (
            <Droppable droppableId={column} key={column}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{column}</h2>
                  <ul>
                    {groupedTasks[column].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="task-item">
                              <span className="task-title">{task.title}</span>
                              <span className="task-description">{task.description}</span>
                              <button onClick={() => changeStatus(task.id, column === "To Do" ? "In Progress" : column === "In Progress" ? "Completed" : "To Do")}>
                                {column === "To Do" ? "Start" : column === "In Progress" ? "Complete" : "Reopen"}
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => deleteTask(task.id)}
                              >
                                x
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  </ul>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
