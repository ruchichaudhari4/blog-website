const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

// ===== MongoDB =====
mongoose
  .connect("mongodb://127.0.0.1:27017/blogApp")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ===== USER =====
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.json({ message: "Signup Successful ✅" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) res.json({ message: "Login Success ✅" });
  else res.json({ message: "Invalid Credentials ❌" });
});

// ===== MULTER =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ===== BLOG =====
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
});

const Blog = mongoose.model("Blog", BlogSchema);

// CREATE
app.post("/create-blog", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : "";

    const blog = new Blog({ title, content, image });
    await blog.save();

    res.json({ message: "Blog Created ✅" });
  } catch {
    res.status(500).json({ message: "Error ❌" });
  }
});

// GET ALL
app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find().sort({ _id: -1 });
  res.json(blogs);
});

// GET ONE
app.get("/blog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

// UPDATE
app.put("/update-blog/:id", async (req, res) => {
  const { title, content } = req.body;

  await Blog.findByIdAndUpdate(req.params.id, { title, content });

  res.json({ message: "Blog Updated ✅" });
});

// DELETE
app.delete("/delete-blog/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Blog Deleted ✅" });
});

// STATIC
app.use("/uploads", express.static("uploads"));

app.listen(5000, () => console.log("Server running"));