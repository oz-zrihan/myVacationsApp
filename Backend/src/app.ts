import express from "express";
import expressFileUpload from "express-fileupload";
import expressRateLimit from "express-rate-limit";
import preventXss from "./3-middleware/prevent-xss";
import helmet from "helmet";
import cors from "cors";
import appConfig from "./4-utils/app-config";
//Routs
import authRout from "./6-routes/auth-routes";
import usersRout from "./6-routes/users-routes";
import followersRout from "./6-routes/followers-routes";
import vacationsRout from "./6-routes/vacations-routes";
import countriesRout from "./6-routes/countries-routes";
import airlinesRout from "./6-routes/airlines-routes";
import luggageRout from "./6-routes/luggage-routes";
import boardsRout from "./6-routes/boards-routes";
import imagesRout from "./6-routes/images-routes";
import routeNotFound from "./3-middleware/route-not-found";
import catchAll from "./3-middleware/catch-all";

const server = express();

// Prevent DoS attack:
server.use(expressRateLimit({
    windowMs: 10000,
    max: 10000,
    message: "To many request"
}));

// Use helmet to defense against malicious headers:
server.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Create CORS policy:
server.use(cors());

// Create request.body object if json was sent:
server.use(express.json());

// Defend from cross-site scripting:
server.use(preventXss);

// Get files sent by the front into request.files object:
server.use(expressFileUpload());
server.use(express.static("./images"));

// Routs:
server.use("/api/auth", authRout);
server.use("/api/users", usersRout);
server.use("/api/followers", followersRout);
server.use("/api/vacations", vacationsRout);
server.use("/api/countries", countriesRout);
server.use("/api/airlines", airlinesRout);
server.use("/api/luggage", luggageRout);
server.use("/api/boards", boardsRout);
server.use("/api/images", imagesRout);
server.use("/", vacationsRout);
server.use("*", routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, () =>
  console.log("Listening on http://localhost:" + appConfig.port)
);
