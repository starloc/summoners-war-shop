"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [monsterName, setMonsterName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [accounts, setAccounts] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase
      .from("accounts")
      .select("*")
      .order("created_at", { ascending: false });

    setAccounts(data || []);
  }

  useEffect(() => {
    if (loggedIn) load();
  }, [loggedIn]);

  function login() {
    if (password === "starloc@96") {
      setLoggedIn(true);
    } else {
      alert("Sai mật khẩu");
    }
  }

  async function add() {
    let url = "";

    if (imageFile) {
      const fileName = Date.now() + imageFile.name;

      const { error } = await supabase.storage
        .from("accounts")
        .upload(fileName, imageFile);

      if (error) return alert(error.message);

      const { data } = supabase.storage
        .from("accounts")
        .getPublicUrl(fileName);

      url = data.publicUrl;
    }

    await supabase.from("accounts").insert([
      {
        monster_name: monsterName,
        price: Number(price),
        description,
        image_url: url,
      },
    ]);

    setMonsterName("");
    setPrice("");
    setDescription("");
    setImageFile(null);

    load();
  }

  async function del(id: string) {
    await supabase.from("accounts").delete().eq("id", id);
    load();
  }

  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      <input
        placeholder="Monster name"
        value={monsterName}
        onChange={(e) => setMonsterName(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) setImageFile(e.target.files[0]);
        }}
      />

      <button onClick={add}>Add Account</button>

      <hr />

      {accounts.map((a) => (
        <div key={a.id}>
          <b>{a.monster_name}</b>
          <p>{a.price}</p>
          <button onClick={() => del(a.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
