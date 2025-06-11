import { todos } from "../../src/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import db from "../../src/db";
import { z } from "zod";

export const TodoSchema = z.object({
  content: z.string()
    .min(1, "Task description is required")
    .max(100, "Task description must be less than 100 characters"),
  priority: z.coerce
    .number()
    .int("Priority must be an integer")
    .min(1, "Priority must be at least 1")
    .max(5, "Priority must be at most 5")
});

export type TodoFormData = z.infer<typeof TodoSchema>;

export async function getAllTodos(sortOrder: "asc" | "desc" = "asc") {
  const order = sortOrder === "desc" ? desc(todos.priority) : asc(todos.priority);
  return db.select().from(todos).orderBy(order);
}

export async function createTodo(content: string, priority: number) {
  await db.insert(todos).values({
    content,
    priority,
  });
}

export async function toggleTodoDone(id: number) {
  const currentTodo = await db.select().from(todos).where(eq(todos.id, id));
  await db.update(todos).set({ done: !currentTodo[0].done }).where(eq(todos.id, id));
}

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id));
}