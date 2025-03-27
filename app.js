const express = require("express");
const userRouter = require("./routes/userRoutes");
const projectRouter = require("./routes/projectRoutes");

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  console.log(req.headers);
  next();
});

// app.use((req,res,next)=>{
//   console.log(req.app);
//   next()
// })

app.use("/api/v1/user", userRouter);
app.use("/api/v1/project", projectRouter);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err,
    stack: err.stack,
  });
});

module.exports = app;
