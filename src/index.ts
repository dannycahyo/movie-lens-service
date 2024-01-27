import "dotenv/config";
import express from "express";
import movieRoutes from "./routes/movieRoutes";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    isSuccessful: true,
    message: "Welcome to Movie Lens API",
  });
});

app.use(movieRoutes);

app.listen(port, () => {
  console.log(`movie lens app listening at http://localhost:${port}`);
});
