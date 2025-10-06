import {
  pgTable,
  uuid,
  varchar,
  numeric,
  text,
  timestamp,
  pgEnum,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const droneModelEnum = pgEnum("drone_model", [
  "Lightweight",
  "Middleweight",
  "Cruiserweight",
  "Heavyweight",
]);

export const droneStateEnum = pgEnum("drone_state", [
  "IDLE",
  "LOADING",
  "LOADED",
  "DELIVERING",
  "DELIVERED",
  "RETURNING",
]);

export const drones = pgTable("drones", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  serialNumber: varchar("serial_number", { length: 100 }).notNull().unique(),
  weight: numeric("weight", { precision: 10, scale: 2 }).notNull(),
  model: droneModelEnum("model").notNull(),
  state: droneStateEnum("state").default("IDLE").notNull(),
  batteryCapacity: numeric("battery_capacity", { precision: 4, scale: 2 })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const medications = pgTable("medications", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  weight: numeric("weight", { precision: 10, scale: 2 }).notNull(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  image: text("image"),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const deliveries = pgTable("deliveries", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  droneSerialNumber: varchar("drone_serial_number", { length: 100 }).notNull(),
  totalWeight: numeric("total_weight", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const deliveryMedications = pgTable(
  "delivery_medications",
  {
    deliveryId: uuid("delivery_id")
      .notNull()
      .references(() => deliveries.id, { onDelete: "cascade" }),
    medicationId: uuid("medication_id")
      .notNull()
      .references(() => medications.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.deliveryId, table.medicationId] }),
  })
);