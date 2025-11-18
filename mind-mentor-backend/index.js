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
const bbbClassRouting = require("./routes/bbbClassRouting/bbbClassLinks");
const bbbClassRoutingNew = require("./routes/bbbClassRouting/bbMMClassLink");
const hostingerRoutingClass = require("./routes/bbbClassRouting/hostingerBB");
const kimsDataRoutes = require("./routes/kimsRoutes/kimsRoute")

// ✅ Import socket setup function
const { initSocket } = require("./utils/socket");

const PORT = 3000;
const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO

app.set("trust proxy", true);

// ✅ Connect to DB
dbConnect();

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://mind-mentors.vercel.app",
  "https://mind-mentors-vt11.vercel.app",
  "https://live.mindmentorz.in",
  "https://3.104.84.126:3000",
  "http://localhost:3000",
  "http://3.104.84.126:3000",
  "https://aswinraj.online",
  "https://bbb.mindmentorz.in",
  "http://app.mindmentorz.in",
  "https://app.mindmentorz.in",
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

// ✅ Generate Zoom Signature
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

// require("./utils/autoGenerateTheMeetingLink");
// require("./utils/zohoDeluge")

// ✅ Routes
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
app.use("/sample/meeting", bbRouteSample);
app.use("/api/class", bbbClassRouting); // DO
app.use("/api/class-new", bbbClassRoutingNew); // AWS
app.use("/api/new-class", hostingerRoutingClass); // Hostinger


app.use("/kims",kimsDataRoutes)



// ✅ Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Fallback for React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Initialize Socket.IO
initSocket(server);

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
