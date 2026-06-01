"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
const [loggedIn, setLoggedIn] = useState(false);
const [password, setPassword] = useState("");

const [monsterName, setMonsterName] = useState("");
const [price, setPrice] = useState("");
const [description, setDescription] = useState("");
const [imageUrl, setImageUrl] = useState("");

const [accounts, setAccounts] = useState<any[]>([]);

async function loadAccounts() {
const { data } = await supabase
.from("accounts")
.select("*")
.order("created_at", { ascending: false });

```
setAccounts(data || []);
```

}

useEffect(() => {
if (loggedIn) {
loadAccounts();
}
}, [loggedIn]);

const login = () => {
if (password === "starloc@96") {
setLoggedIn(true);
} else {
alert("Sai mật khẩu");
}
};

async function addAccount() {
if (!monsterName || !price) {
alert("Thiếu thông tin");
return;
}

```
const { error } = await supabase.from("accounts").insert([
  {
    monster_name: monsterName,
    price: Number(price),
    description,
    image_url: imageUrl,
  },
]);

if (error) {
  alert(error.message);
  return;
}

setMonsterName("");
setPrice("");
setDescription("");
setImageUrl("");

loadAccounts();
```

}

async function deleteAccount(id: string) {
if (!confirm("Xóa account này?")) return;

```
await supabase
  .from("accounts")
  .delete()
  .eq("id", id);

loadAccounts();
```

}

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
> <h2>Admin Login</h2>

```
      <input
        type="password"
        value={password}
        placeholder="Mật khẩu"
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
```

}

return (
<main
style={{
background: "#111",
minHeight: "100vh",
color: "#fff",
padding: "20px",
}}
> <h1>Admin Panel</h1>

```
  <div
    style={{
      background: "#1b1b1b",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "20px",
    }}
  >
    <input
      placeholder="Tên Monster"
      value={monsterName}
      onChange={(e) => setMonsterName(e.target.value)}
      style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
    />

    <input
      placeholder="Giá"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
    />

    <textarea
      placeholder="Mô tả"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
    />

    <input
      placeholder="URL ảnh"
      value={imageUrl}
      onChange={(e) => setImageUrl(e.target.value)}
      style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
    />

    <button
      onClick={addAccount}
      style={{
        padding: "12px 20px",
      }}
    >
      Thêm Account
    </button>
  </div>

  {accounts.map((acc) => (
    <div
      key={acc.id}
      style={{
        background: "#1b1b1b",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "12px",
      }}
    >
      <strong>{acc.monster_name}</strong>

      <div>
        {Number(acc.price).toLocaleString("vi-VN")} VNĐ
      </div>

      <button
        onClick={() => deleteAccount(acc.id)}
        style={{
          marginTop: "10px",
        }}
      >
        Xóa
      </button>
    </div>
  ))}
</main>

);
}
