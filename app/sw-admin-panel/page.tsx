"use client";

import { useState } from "react";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const login = () => {
    if (password === "starloc@96") {
      setLoggedIn(true);
    } else {
      alert("Sai mật khẩu");
    }
  };

  if (!loggedIn) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#111",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#1b1b1b",
            padding: "30px",
            borderRadius: "12px",
            width: "320px",
          }}
        >
          <h2>Admin Login</h2>

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "12px",
            }}
          >
            Đăng nhập
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h1>Admin Panel</h1>

      <p>Đăng nhập thành công.</p>

      <p>Bước tiếp theo sẽ thêm form CRUD.</p>
    </main>
  );
}
