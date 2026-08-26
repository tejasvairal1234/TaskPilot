import express from "express";
import protect from "../middlewares/protectMiddleware.js";

const taskRoute = express.Router();

taskRoute.post("/create", protect,);
taskRoute.get("/", protect,);
taskRoute.get("/:id", protect,);
taskRoute.patch("/update/:id", protect,);
taskRoute.delete("/delete/:id", protect,);

export default taskRoute;