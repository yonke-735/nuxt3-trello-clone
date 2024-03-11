import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import boardData from "~/data/board.json";
import { v4 as uuid } from "uuid";

export const useBoardStore = defineStore("boardStore", () => {
  const board = useStorage("board", boardData);

  const getTask = computed(() => {
    return (taskId: string) => {
      for (const column of board.value.columns) {
        const task = column.tasks.find((task) => task.id === taskId);
        if (task) {
          return task;
        }
      }
    };
  });

  function deleteTask(taskId: string) {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        return;
      }
    }
  }

  function moveTask(
    fromTaskIndex: number,
    fromColumnIndex: number,
    toColumnIndex: number,
    toTaskIndex: number,
  ) {
    const task = board.value.columns[fromColumnIndex].tasks.splice(
      fromTaskIndex,
      1
    )[0];
    board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task);
  }

  function moveColumn(fromColumnIndex: number, toColumnIndex: number) {
    const column = board.value.columns.splice(fromColumnIndex, 1)[0];
    board.value.columns.splice(toColumnIndex, 0, column)

  }

  function addTask(columnIndex: number, taskName: string) {
    board.value.columns[columnIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: "",
    });
  }

  function addColumn(columnName: string) {
    board.value.columns.push({
      id: uuid(),
      name: columnName,
      tasks: [],
    });
  }

  function deleteColumn(columnIndex: number) {
    board.value.columns.splice(columnIndex, 1);
  }

  return {
    /* state */
    board,
    /* getters */
    getTask,
    /* actions */
    addColumn,
    deleteColumn,
    addTask,
    deleteTask,
    moveTask,
    moveColumn,
  };
});
