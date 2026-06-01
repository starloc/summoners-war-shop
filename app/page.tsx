import { supabase } from "../lib/supabase";

export default async function Home() {
const { data: accounts } = await supabase
.from("accounts")
.select("*")
.order("created_at", { ascending: false });

return (
<main
style={{
minHeight: "100vh",
background: "#0f0f0f",
color: "#ffffff",
fontFamily: "Arial, sans-serif",
}}
>
<div
style={{
background: "linear-gradient(135deg,#2b1d14,#111111)",
padding: "40px 20px",
textAlign: "center",
borderBottom: "1px solid #3a2b22",
}}
>
<h1
style={{
margin: 0,
fontSize: "40px",
color: "#f2c078",
}}
>
Summoners War Starter Shop </h1>

```
    <p
      style={{
        color: "#b8a89a",
        marginTop: "10px",
      }}
    >
      Account Starter • LD Starter • Reroll
    </p>

    <a
      href="https://zalo.me/0948258616"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "15px",
        background: "#8b5e3c",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: "bold",
      }}
    >
      Liên hệ Zalo
    </a>
  </div>

  <div
    style={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "25px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "24px",
    }}
  >
    {accounts?.map((acc) => (
      <div
        key={acc.id}
        style={{
          background: "#1b1b1b",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid #2f2f2f",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        {acc.image_url && (
          <img
            src={acc.image_url}
            alt={acc.monster_name}
            style={{
              width: "100%",
              height: "260px",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        <div
          style={{
            padding: "18px",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px 0",
              fontSize: "22px",
            }}
          >
            {acc.monster_name}
          </h2>

          <div
            style={{
              fontSize: "28px",
              color: "#f2c078",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            {Number(acc.price).toLocaleString("vi-VN")}₫
          </div>

          <p
            style={{
              color: "#cccccc",
              minHeight: "60px",
              lineHeight: "1.5",
            }}
          >
            {acc.description}
          </p>

          <a
            href="https://zalo.me/0948258616"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              background: "#8b5e3c",
              color: "#ffffff",
              padding: "12px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            Mua ngay
          </a>
        </div>
      </div>
    ))}
  </div>

  <a
    href="https://zalo.me/0948258616"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: "fixed",
      right: "20px",
      bottom: "20px",
      background: "#0068ff",
      color: "#ffffff",
      padding: "14px 18px",
      borderRadius: "999px",
      textDecoration: "none",
      fontWeight: "bold",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    }}
  >
    Zalo
  </a>
</main>

);
}
