"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      setAccounts(data || []);
    }

    load();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#fff",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg,#2b1d14,#111)",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 40, color: "#f2c078", margin: 0 }}>
          Summoners War Shop
        </h1>

        <p style={{ color: "#aaa" }}>
          Account Starter • LD • Reroll
        </p>

        <a
          href="https://zalo.me/0948258616"
          target="_blank"
          style={{
            display: "inline-block",
            marginTop: 10,
            background: "#8b5e3c",
            padding: "10px 20px",
            borderRadius: 10,
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Liên hệ Zalo
        </a>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
          padding: 20,
        }}
      >
        {accounts.map((acc) => (
          <div
            key={acc.id}
            style={{
              background: "#1b1b1b",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #333",
            }}
          >
            {acc.image_url && (
              <img
                src={acc.image_url}
                onClick={() => setPreview(acc.image_url)}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            )}

            <div style={{ padding: 15 }}>
              <h2 style={{ margin: 0 }}>{acc.monster_name}</h2>

              <p style={{ color: "#aaa", fontSize: 12 }}>
                {acc.created_at
                  ? new Date(acc.created_at).toLocaleString("vi-VN")
                  : ""}
              </p>

              <p style={{ color: "#f2c078", fontSize: 20 }}>
                {Number(acc.price).toLocaleString("vi-VN")}₫
              </p>

              <p style={{ color: "#ccc" }}>{acc.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={preview}
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </main>
  );
}
