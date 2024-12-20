const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");


// const { PORT } = require("./config/variables/variables");
const dbConnect = require("./config/database/dbConnect")
const parentRoute = require("./routes/parent/parentRoute")
const operationRoute = require("./routes/employee/opertation-dept/operationDeptRoute")
const kidRoute = require("./routes/kid/kidRoutes")
const coachRoute = require("./routes/coach/CoachRoute");
const serviceRoute = require("./routes/servicedelivery/serviceDeliveryRoute");
const userRoute = require("./routes/superadmin/superAdminRoute")
const PORT = 3000

app.set("trust proxy", true);

// DATABASE CONNECTION
dbConnect()

app.use(cookieParser());
app.use(express.json());   

const allowedOrigins = ["http://localhost:5173","https://mind-mentors.vercel.app"];

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

app.disable("x-powered-by");


app.use("/parent",parentRoute)
app.use("/employee/operation",operationRoute)
app.use("/kid",kidRoute)
app.use("/coach",coachRoute)
app.use("/service",serviceRoute)
app.use("/superadmin",userRoute)


app.post('/create-meeting', async (req, res) => {
  try {
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
      topic: req.body.topic,
      type: 1, // Instant meeting
      settings: {
        host_video: true,
        participant_video: true
      }
    }, {
      headers: {
        'Authorization': `Bearer YOUR_ZOOM_JWT_TOKEN`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      meetingNumber: response.data.id,
      password: response.data.password
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});







app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
