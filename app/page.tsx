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
        background: "#1f1713",
        color: "#f5efe6",
        padding: "20px",
      }}
    >
      <h1>Summoners War Shop</h1>

      <div
        style={{
          display: "grid",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {accounts?.map((acc) => (
          <div
            key={acc.id}
            style={{
              background: "#2d221c",
              padding: "16px",
              borderRadius: "12px",
            }}
          >
            <h2>{acc.monster_name}</h2>

            <p>
              Giá: {Number(acc.price).toLocaleString("vi-VN")} VNĐ
            </p>

            <p>{acc.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
