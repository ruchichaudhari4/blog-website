"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ViewBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/blog/${id}`)
      .then((res) => res.json())
      .then(setBlog);
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>

      {blog.image && (
        <img src={`http://localhost:5000/uploads/${blog.image}`} width="300" />
      )}
    </div>
  );
}