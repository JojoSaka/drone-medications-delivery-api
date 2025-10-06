import { Router } from "express"
import { getAllDeliveries, getDeliveryDetails } from "../controllers/delivery.controller.js";

const deliveryRouter = Router();

deliveryRouter.get("/", getAllDeliveries)
deliveryRouter.get("/:id", getDeliveryDetails)

export default deliveryRouter;