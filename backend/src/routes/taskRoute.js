import express from "express";

const taskRoute = express.Router();

taskRoute.post("/create",);
taskRoute.get("/",);
taskRoute.get("/task/:id",);
taskRoute.patch("/task/:id",);
taskRoute.delete("/task/:id",);

export default taskRoute;