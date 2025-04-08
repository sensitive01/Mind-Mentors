const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const http = require("http");

const dbConnect = require("./config/database/dbConnect");
const parentRoute = require("./routes/parent/parentRoute");
const operationRoute = require("./routes/employee/opertation-dept/operationDeptRoute");
const kidRoute = require("./routes/kid/kidRoutes");
const coachRoute = require("./routes/coach/CoachRoute");
const serviceRoute = require("./routes/servicedelivery/serviceDeliveryRoute");
const userRoute = require("./routes/superadmin/superAdminRoute");
const zoomRoute = require("./routes/zoom/zoomRoute");
const hrRoutes = require("./routes/hr/hrRoutes");
const joinRoute = require("./routes/classRoom/classRoomRoutes");
const bbRoutes = require("./routes/bbRoute/blueButtonRoute");
const bbRouteSample = require("./routes/bbRoute/bigBlueButtonSample");
const bbbClassRouting = require("./routes/bbbClassRouting/bbbClassLinks")




const { initSocket } = require("./utils/socket");

const PORT = 3000;
const app = express();
const server = http.createServer(app); // HTTP Server for WebSocket

app.set("trust proxy", true);

// DATABASE CONNECTION
dbConnect();

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://mind-mentors.vercel.app",
  "https://mind-mentors-vt11.vercel.app",
  "http://3.104.84.126:3000",
  "http://3.104.84.126",
  "https://3.104.84.126:3000",
  "https://3.104.84.126",
  "http://127.0.0.1:5500",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS error: Origin ${origin} is not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString(
    "base64"
  );
  const hash = crypto
    .createHmac("sha256", apiSecret)
    .update(msg)
    .digest("base64");
  const signature = Buffer.from(
    `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
  ).toString("base64");

  return signature;
}

app.disable("x-powered-by");

// ✅ Register Routes
app.use("/parent", parentRoute);
app.use("/employee/operation", operationRoute);
app.use("/kid", kidRoute);
app.use("/coach", coachRoute);
app.use("/service", serviceRoute);
app.use("/superadmin", userRoute);
app.use("/hr", hrRoutes);
app.use("/join", joinRoute);
app.use("/zoom/api", zoomRoute);
app.use("/api/meeting", bbRoutes);
app.use("/sample/meeting",bbRouteSample)
app.use("/api/class",bbbClassRouting)


app.use(express.static(path.join(__dirname, "dist")));

// Handle SPA (Single Page Application) fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Initialize WebRTC Signaling (Socket.IO)
initSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
