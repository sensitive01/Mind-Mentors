const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

// const { PORT } = require("./config/variables/variables");
const dbConnect = require("./config/database/dbConnect");
const parentRoute = require("./routes/parent/parentRoute");
const operationRoute = require("./routes/employee/opertation-dept/operationDeptRoute");
const kidRoute = require("./routes/kid/kidRoutes");
const coachRoute = require("./routes/coach/CoachRoute");
const serviceRoute = require("./routes/servicedelivery/serviceDeliveryRoute");
const userRoute = require("./routes/superadmin/superAdminRoute");
const zoomRoute = require("./routes/zoom/zoomRoute");
const PORT = 3000;

app.set("trust proxy", true);

// DATABASE CONNECTION
dbConnect();

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://mind-mentors.vercel.app",
  "https://mind-mentors-vt11.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS error for origin: ${origin}`);
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

app.use("/parent", parentRoute);
app.use("/employee/operation", operationRoute);
app.use("/kid", kidRoute);
app.use("/coach", coachRoute);
app.use("/service", serviceRoute);
app.use("/superadmin", userRoute);
app.use("/zoom/api", zoomRoute);

app.post("/api/get-signature", (req, res) => {
  console.log("zoom welcome", req.body);
  const { meetingNumber, role } = req.body;

  try {
    const signature = generateSignature(
      "1R8cvp2KTCGJQl9zzX8gQ",
      "vraDNr4XDr8C3itjb6q8ml5CPMMH8QXs",
      meetingNumber,
      role
    );
    console.log(signature);

    res.json({ signature });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate signature" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
