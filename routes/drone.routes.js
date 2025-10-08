import { Router } from "express"
import { addDrone, getAllDrones, getAllIdleDrones, getDroneBattery, getDroneDetails, getMedicationsLoadedOnDrone, loadDrone, updateDroneState } from "../controllers/drone.controller.js";

const droneRouter = Router();

droneRouter.get("/", getAllDrones)
droneRouter.post("/add", addDrone)
droneRouter.post("/loaded/:serialnumber", getMedicationsLoadedOnDrone)
droneRouter.get("/idle", getAllIdleDrones)
droneRouter.get("/:id", getDroneDetails)
droneRouter.post("/load/:serialnumber", loadDrone)
droneRouter.get("/battery/:serialnumber", getDroneBattery)
droneRouter.patch("/:serialnumber", updateDroneState)

export default droneRouter;