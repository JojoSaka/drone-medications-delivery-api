import { eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import {
  deliveries,
  deliveryMedications,
  drones,
  medications,
} from "../database/schema.js";
import { droneSchema, medicationsListSchema } from "../lib/utils.js";
import { success } from "zod";

export const addDrone = async (req, res, next) => {
  try {
    const validated = droneSchema.parse(req.body);
    const { serialNumber, weight, model, batteryCapacity } = validated;

    const existingDrone = await db
      .select()
      .from(drones)
      .where(eq(drones.serialNumber, serialNumber))
      .limit(1);

    if (existingDrone.length > 0) {
      const error = new Error("Drone already exists");
      error.statusCode = 400;
      throw error;
    }

    const newDrone = await db.insert(drones).values({
      serialNumber,
      weight,
      model,
      batteryCapacity,
    }).returning();

    res.status(201).json({
      success: true,
      message: "Drone added succesfully",
      data: newDrone,
    });
  } catch (err) {
    res.status(400).json({ error: err });
    console.log(err)
  }
};

export const getAllDrones = async (req, res, next) => {
  try {
    const allDrones = await db.select().from(drones);

    res.status(200).json({
      success: true,
      message: "All drones fetched succesfully",
      data: allDrones,
    });
  } catch (error) {
    next(error);
  }
};

export const getDroneDetails = async (req, res, next) => {
  const id = req.params.id;

  try {
    const droneDetails = await db
      .select()
      .from(drones)
      .where(eq(drones.id, id))
      .limit(1);

    if(droneDetails.length == 0) {
      const error = new Error("Drone not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Drone details fetched successfully",
      data: droneDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const loadDrone = async (req, res, next) => {
  const serialNumber = req.params.serialnumber;

  try {
    const validated = medicationsListSchema.parse(req.body);

    const medicationsList = validated;

    const drone = await db
      .select()
      .from(drones)
      .where(eq(drones.serialNumber, serialNumber))
      .limit(1);

    if (drone.length == 0) {
      const error = new Error("Drone does not exist");
      error.statusCode = 400;
      throw error;
    }

    if(drone[0].state == "IDLE") {
      await db
      .update(drones)
      .set({ state: "LOADING" })
      .where(eq(drones.serialNumber, serialNumber));
    }

    if (drone[0].state != "LOADING") {
      const error = new Error("Drone is not in the loading state");
      error.statusCode = 400;
      throw error;
    }

    if (drone[0].batteryCapacity < 0.25) {
      const error = new Error("Drone battery is below 25%");
      error.statusCode = 400;
      throw error;
    }

    const totalWeight = medicationsList.reduce(
      (sum, m) => sum + m.weight * m.quantity,
      0
    );

    if (totalWeight > Number(drone[0].weight)) {
      const error = new Error("Total medication weight exceeds drone capacity");
      error.statusCode = 400;
      throw error;
    }

    await db
      .update(drones)
      .set({ state: "LOADING" })
      .where(eq(drones.serialNumber, serialNumber));

    const [delivery] = await db
      .insert(deliveries)
      .values({
        droneSerialNumber: drone[0].serialNumber,
        totalWeight,
      })
      .returning();

    for (const med of medicationsList) {
      const [insertedMed] = await db
        .insert(medications)
        .values({
          name: med.name,
          weight: med.weight,
          code: med.code,
          quantity: med.quantity,
          image: med.image,
        })
        .returning();

      await db.insert(deliveryMedications).values({
        deliveryId: delivery.id,
        medicationId: insertedMed.id,
      });
    }

    await db
      .update(drones)
      .set({ state: "LOADED" })
      .where(eq(drones.serialNumber, serialNumber));

    // await db
    //   .update(drones)
    //   .set({ state: "DELIVERING" })
    //   .where(eq(drones.serialNumber, serialNumber));

    res.status(201).json({
      success: true,
      message: "Drone succesfully loaded and medications are ready to be delivered",
      delivery_id: delivery.id,
    });
  } catch (err) {
    res.status(400).json({ error: err.errors ?? err.message });
    console.log(err)
  }
};

export const getDroneBattery = async (req, res, next) => {
  const serialNumber = req.params.serialnumber;

  try {
    const droneDetails = await db
      .select()
      .from(drones)
      .where(eq(drones.serialNumber, serialNumber))
      .limit(1);

    res.status(200).json({
      success: true,
      message: "Drone battery capacity fetched successfully",
      data: droneDetails[0].batteryCapacity,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllIdleDrones = async (req, res, next) => {
  
  try {
    const idleDrones = await db
      .select()
      .from(drones)
      .where(eq(drones.state, "IDLE"));

    res.status(200).json({
      success: true,
      message: "All idle drones fetched successfully",
      data: idleDrones
    })
  } catch (error) {
    next(error);
  }
};

export const getMedicationsLoadedOnDrone = async (req, res, next) => {
  const serialNumber = req.params.serialnumber;

  try {
    const drone = await db
      .select()
      .from(drones)
      .where(eq(drones.serialNumber, serialNumber))
      .limit(1);

    if (drone.length == 0) {
      const error = new Error("Drone not found");
      res.statusCode = 400;
      throw error;
    }

    if (drone[0].state == "IDLE") {
      const error = new Error("This drone has not being loaded");
      res.statusCode = 400;
      throw error;
    }

    const deliveryByDrone = await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.droneSerialNumber, serialNumber))
      .limit(1);

    if (deliveryByDrone.length == 0) {
      const error = new Error(
        "No medications have been loaded for delivery on this drone"
      );
      res.statusCode = 400;
      throw error;
    }

    const medicationIds = await db
      .select({ medicationId: deliveryMedications.medicationId })
      .from(deliveryMedications)
      .where(eq(deliveryMedications.deliveryId, deliveryByDrone[0].id));

    const medicationsLoaded = [];

    for (const med of medicationIds) {
      const medication = await db
        .select()
        .from(medications)
        .where(eq(medications.id, med.medicationId))
        .limit(1);

      medicationsLoaded.push(medication[0]);
    }

    res.status(201).json({
      success: true,
      message: "Medications loaded on the drone fetched successfully",
      data: medicationsLoaded,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDroneState = async (req, res, next) => {
  const { serialnumber } = req.params.serialnumber;

  const { state } = req.body;

  try {
    const existingDrone = await db.select()
    .from(drones)
    .where(eq(drones.serialNumber, serialnumber))
    .limit(1);

    if(existingDrone.length == 0) {
      const error = new Error("Drone not found");
      error.statusCode = 404;
      throw error;
    }

    await db.update(drones)
    .set({ state: state})
    .where(eq(drones.serialNumber, serialnumber))

    res.status(200).json({
      success: true,
      message: "Drone state has been updated"
    })
    
  } catch(error) {
    next(error)
  }
}