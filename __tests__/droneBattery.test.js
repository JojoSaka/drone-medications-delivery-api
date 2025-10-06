// Mock database before importing controller
jest.mock("../database/drizzle.js", () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnValue([{ batteryCapacity: 0.85 }]),
    })),
  },
}));

import express from "express";
import request from "supertest";
import { db } from "../database/drizzle.js";
import { getDroneBattery } from '../controllers/drone.controller.js';

const app = express();
app.get("/battery/:serialnumber", getDroneBattery);

describe("GET /battery/:serialnumber", () => {
  it("should return the drone battery successfully", async () => {
    const res = await request(app).get("/battery/DRONE123");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBe(0.85);
    expect(db.select).toHaveBeenCalled();
  });

  it("should handle database errors", async () => {
    db.select.mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    const res = await request(app).get("/battery/DRONE999");
    expect(res.status).toBe(500);
  });
});