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
        background: "#17120f",
        color: "#f5efe6",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Summoners War Starter Accounts
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#b8a89a",
            marginBottom: "30px",
          }}
        >
          Liên hệ Zalo: 0948258616
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {accounts?.map((acc) => (
            <div
              key={acc.id}
              style={{
                background: "#2d221c",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #4b382d",
              }}
            >
              {acc.image_url && (
                <img
                  src={acc.image_url}
                  alt={acc.monster_name}
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}

              <div
                style={{
                  padding: "16px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px 0",
                  }}
                >
                  {acc.monster_name}
                </h2>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#f2c078",
                    marginBottom: "12px",
                  }}
                >
                  {Number(acc.price).toLocaleString("vi-VN")} VNĐ
                </div>

                <p
                  style={{
                    color: "#d9cfc7",
                    marginBottom: "15px",
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
                    display: "inline-block",
                    background: "#8b5e3c",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                  }}
                >
                  Liên hệ Zalo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
