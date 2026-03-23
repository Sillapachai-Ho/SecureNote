import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";

const port = process.env.PORT || 5000;
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "https://secure-note-notesboy.vercel.app", //deploy vercel
    // origin: "http://localhost:5173", //local host
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Request: ${req.method} ${req.url}`,
  );
  next();
});

const PB_BASE_URL = process.env.POCKETBASE_URL;
const PB_TOKEN = process.env.POCKETBASE_TOKEN;

const generateNumericId = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return timestamp + randomNum;
};

// Middleware
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No Session: กรุณาล็อกอิน" });
    }

    const verifyUrl = `${PB_BASE_URL}/api/collections/users/auth-refresh`;
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Session Expired: เซสชันหมดอายุ" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//Sign Up
app.post("/api/signup", async (req, res) => {
  const PB_USERS_URL = `${PB_BASE_URL}/api/collections/users/records`;
  const newNumericId = generateNumericId();
  const userData = {
    ...req.body,
    id: newNumericId,
  };

  try {
    const response = await fetch(PB_USERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ message: "สมัครสมาชิกสำเร็จ", user: data });
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

//Login
app.post("/api/login", async (req, res) => {
  try {
    const PB_AUTH_URL = `${PB_BASE_URL}/api/collections/users/auth-with-password`;

    const response = await fetch(PB_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: req.body.username,
        password: req.body.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.json({
        message: "Login Success",
        token: data.token,
        userId: data.record.id,
        username:
          data.record.username ||
          data.record.name ||
          data.record.email ||
          "User",
      });
    } else {
      res.status(401).json({ message: "Username หรือ Password ไม่ถูกต้อง" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//ดึงข้อมูลทั้งหมด
app.get("/api/notes", requireAuth, async (req, res) => {
  try {
    const userIdString = req.query.userId;
    const filterQuery = userIdString
      ? `?filter=(user_id=${parseInt(userIdString, 10)})&sort=-created`
      : `?sort=-created`;

    const targetUrl = `${PB_BASE_URL}/api/collections/notes/records${filterQuery}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PB_TOKEN}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching from PocketBase" });
  }
});

//เพิ่มข้อมูลใหม่
app.post("/api/notes", requireAuth, async (req, res) => {
  try {
    const targetUrl = `${PB_BASE_URL}/api/collections/notes/records`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PB_TOKEN}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error creating note" });
  }
});

//แก้ไขข้อมูลโน้ตตาม ID
app.patch("/api/notes/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const targetUrl = `${PB_BASE_URL}/api/collections/notes/records`;

    const response = await fetch(`${targetUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PB_TOKEN}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
});

//ลบข้อมูลตาม ID 
app.delete("/api/notes/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const targetUrl = `${PB_BASE_URL}/api/collections/notes/records`;

    const response = await fetch(`${targetUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${PB_TOKEN}`,
      },
    });

    if (response.ok) {
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(response.status).json({ message: "Failed to delete" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
