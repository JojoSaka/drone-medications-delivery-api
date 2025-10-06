import { z } from "zod";

export const droneSchema = z.object({
  serialNumber: z.string().max(100),
  model: z.enum([
    "Lightweight",
    "Middleweight",
    "Cruiserweight",
    "Heavyweight",
  ]),
  weight: z.number().positive().max(500),
  batteryCapacity: z.number().min(0).max(1),
  state: z
    .enum(["IDLE", "LOADING", "LOADED", "DELIVERING", "DELIVERED", "RETURNING"])
    .default("IDLE"),
});

export const medicationSchema = z.object({
  name: z
    .string()
    .max(100)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Name can only contain letters, numbers, '-', and '_'"
    ),
  weight: z.number().positive("Weight must be greater than 0"),
  quantity: z.number().positive("quantity must be greater than 0"),
  code: z
    .string()
    .max(100)
    .regex(
      /^[A-Z0-9_]+$/,
      "Code must contain only uppercase letters, numbers, and '_'"
    ),
  image: z.string(),
});

export const medicationsListSchema = z
  .array(medicationSchema)
  .nonempty("At least one medication is required");
