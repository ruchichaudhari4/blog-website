"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const router = useRouter();

  const fetchBlogs = async () => {
    const res = await fetch("http://localhost:5000/blogs");
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/delete-blog/${id}`, {
      method: "DELETE",
    });
    fetchBlogs();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔥 All Blogs</h1>

      {blogs.map((blog) => (
        <div key={blog._id} style={{ margin: "15px 0" }}>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>

          {blog.image && (
            <img
              src={`http://localhost:5000/uploads/${blog.image}`}
              width="200"
            />
          )}

          <br />

          <button onClick={() => router.push(`/blog/${blog._id}`)}>
            👁 View
          </button>

          <button onClick={() => router.push(`/edit-blog/${blog._id}`)}>
            ✏ Edit
          </button>

          <button onClick={() => handleDelete(blog._id)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
}