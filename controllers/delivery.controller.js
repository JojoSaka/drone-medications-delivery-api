import { deliveries } from "../database/schema.js";
import { db } from "../database/drizzle.js";
import { eq } from "drizzle-orm";

export const getAllDeliveries = async (req, res, next) => {
  try {
    const allDeliveries = await db.select().from(deliveries);

    res.status(200).json({
      success: true,
      message: "All deliveries fetched successfully",
      data: allDeliveries,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryDetails = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deliveryDetails = await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.id, id))
      .limit(1);

    if (deliveryDetails.length == 0) {
      const error = new Error("Delivery details not found for this delivery");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Delivery details fetched successfully",
      data: deliveryDetails[0],
    });
  } catch (error) {
    next(error);
  }
};