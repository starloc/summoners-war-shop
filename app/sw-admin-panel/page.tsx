"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [monsterName, setMonsterName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [accounts, setAccounts] = useState<any[]>([]);

  async function loadAccounts() {
    const { data } = await supabase
      .from("accounts")
      .select("*")
      .order("created_at", { ascending: false });

    setAccounts(data || []);
  }

  useEffect(() => {
    if (loggedIn) loadAccounts();
  }, [loggedIn]);

  function login() {
    if (password === "starloc@96") {
      setLoggedIn(true);
    } else {
      alert("Sai mật khẩu");
    }
  }

  async function addAccount() {
    if (!monsterName || !price) {
      alert("Thiếu thông tin");
      return;
    }

    let uploadedImageUrl = "";

    if (imageFile) {
      const fileName = Date.now() + "-" + imageFile.name;

      const { error } = await supabase.storage
        .from("accounts")
        .upload(fileName, imageFile);

      if (error) {
        alert(error.message);
        return;
      }

      const { data } = supabase.storage
        .from("accounts")
        .getPublicUrl(fileName);

      uploadedImageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("accounts").insert([
      {
        monster_name: monsterName,
        price: Number(price),
        description,
        image_url: uploadedImageUrl,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    setMonsterName("");
    setPrice("");
    setDescription("");
    setImageFile(null);

    loadAccounts();
  }

  async function deleteAccount(id: string) {
    await supabase.from("accounts").delete().eq("id", id);
    loadAccounts();
  }

  if (!loggedIn) {
    return (
      <main style={{ minHeight: "100vh", background: "#111", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ background: "#1b1b1b", padding: 30, borderRadius: 12, width: 320 }}>
          <h2>Admin Login</h2>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />

          <button onClick={login} style={{ width: "100%", padding: 12 }}>
            Đăng nhập
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#111", color: "#fff", padding: 20 }}>
      <h1>Admin Panel</h1>

      <div style={{ background: "#1b1b1b", padding: 20, borderRadius: 12, marginBottom: 20 }}>
        <input
          placeholder="Tên Monster"
          value={monsterName}
          onChange={(e) => setMonsterName(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <textarea
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setImageFile(e.target.files[0]);
          }}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button onClick={addAccount} style={{ padding: 12 }}>
          Thêm Account
        </button>
      </div>

      {accounts.map((acc) => (
        <div key={acc.id} style={{ background: "#1b1b1b", padding: 15, borderRadius: 12, marginBottom: 12 }}>
          <strong>{acc.monster_name}</strong>
          <div>{Number(acc.price).toLocaleString("vi-VN")} VNĐ</div>

          <button onClick={() => deleteAccount(acc.id)} style={{ marginTop: 10 }}>
            Xóa
          </button>
        </div>
      ))}
    </main>
  );
}
