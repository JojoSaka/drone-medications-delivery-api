import express from "express";
import { PORT } from "./config/env.js";
import droneRouter from "./routes/drone.routes.js";
import deliveryRouter from "./routes/delivery.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api/v1/drones", droneRouter);
app.use("/api/v1/deliveries", deliveryRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Welcome to the drone delivery app api")
});

app.listen(PORT, async () => {
    console.log(`localhost/${PORT}`)
})

export default app;