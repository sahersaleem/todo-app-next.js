"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { FaEdit} from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

interface ITodo {
  id: number;
  todo: string;
}
export default function Home() {
  const [tasks, setTasks] = useState<ITodo[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [mounted, setisMounted] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<string>("");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks((prevTask) => [
        ...prevTask,
        {
          todo: newTask,
          id: Date.now(),
        },
      ]);

      setNewTask("");
    } else {
      alert("Please enter task");
    }
  };

  const handleDelete = (id: number) => {
    const filterTodos = tasks!.filter((task) => task.id !== id);
    setTasks(filterTodos);
  };

  const handleEdit = (task: string, id: number) => {
    setEditTask(task);
    setEditTaskId(id);
  };

  const handleUpdateTask = () => {
    if (editTask.trim() !== "") {
      setTasks(
        tasks.map((item) =>
          item.id === editTaskId ? { ...item, todo: editTask } : item
        )
      );
    }
    setEditTask("");
    setEditTaskId(null);
  };

  useEffect(() => {
    setisMounted(true);
    const savedtask = localStorage.getItem("todos");
    console.log("task get");
    if (savedtask) {
      const parsedTask = JSON.parse(savedtask);

      if (Array.isArray(parsedTask)) {
        setTasks(parsedTask);
      }
    }
  }, []);
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(tasks));
      console.log("task stored");
    }
  }, [tasks, mounted]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-auto bg-slate-200 text-black px-20 py-7 rounded-xl">
        <h1 className="text-3xl mb-4 font-bold">Todo App</h1>

        <form onSubmit={handleSubmit} className="flex gap-x-4">
          <input
          className="px-2 py-1 rounded-sm border-[4px] border-black"
            name="todo"
            value={newTask}
            onChange={(e) => {
              setNewTask(e.target.value);
            }}
            placeholder="Enter todo"
          />{" "}
          <button className="bg-black text-white px-4" type="submit">Add</button>
        </form>
        <div>
          {tasks?.map((item) => {
            return (
              <div
                className="flex gap-4 justify-center items-center"
                key={item.id}
              >
                {item.id === editTaskId ? (
                  <input
                    value={editTask}
                    onChange={(e) => {
                      setEditTask(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        handleUpdateTask();
                      }
                    }}
                    placeholder="edit task"
                  />
                ) : (
                  <p className="text-lg ml-10 text-wrap w-1/2">{item.todo}</p>
                )}
<div className="flex justify-around items-center  w-full py-5">
               
                <div className="flex gap-x-4 text-xl">
                <button
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                >
                  <FaDeleteLeft /> 
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleEdit(item.todo, item.id);
                  }}
                >
                  <FaEdit /> 
                </button>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
