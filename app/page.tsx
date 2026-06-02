"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function getAccountAge(date: string) {
  if (!date) return 0;

  const created = new Date(date);
  const today = new Date();

  const diff =
    today.getTime() - created.getTime();

  return Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );
}

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
    <main className="page">
      {/* HEADER */}
      <div className="header">
        <h1>Summoners War Shop</h1>
        <p>Starter • LD • Reroll Accounts</p>

        <a className="btn" href="https://zalo.me/0948258616">
          Liên hệ Zalo
        </a>
      </div>

      {/* GRID */}
      <div className="grid">
        {accounts.map((acc) => (
          <div className="card" key={acc.id}>
            {acc.image_url && (
              <img
                src={acc.image_url}
                className="img"
                onClick={() => setPreview(acc.image_url)}
              />
            )}

            <div className="content">
              <h2>{acc.monster_name}</h2>

              <span className="price">
                {Number(acc.price).toLocaleString("vi-VN")}₫
              </span>

              <p className="desc">{acc.description}</p>

              <p
                style={{
                  color: "#f2c078",
                  fontWeight: "bold",
                }}
              >
                Tuổi acc: {getAccountAge(acc.account_created_date)} ngày
              </p>

              <small className="time">
                {acc.created_at
                  ? new Date(acc.created_at).toLocaleString("vi-VN")
                  : ""}
              </small>

              <a className="buy" href="https://zalo.me/0948258616">
                Mua ngay
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="modal" onClick={() => setPreview(null)}>
          <img src={preview} />
        </div>
      )}

      {/* STYLE */}
      <style jsx>{`
        .page {
          background: #0e0e0e;
          color: white;
          min-height: 100vh;
        }

        /* HEADER MOBILE CLEAN */
        .header {
          text-align: center;
          padding: 28px 16px;
          background: linear-gradient(135deg, #2b1d14, #0f0f0f);
          border-bottom: 1px solid #2a2a2a;
        }

        .header h1 {
          font-size: 26px;
          margin: 0;
          color: #f2c078;
        }

        .header p {
          color: #aaa;
          font-size: 13px;
          margin-top: 6px;
        }

        .btn {
          display: inline-block;
          margin-top: 10px;
          padding: 10px 14px;
          background: #8b5e3c;
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
        }

        /* GRID MOBILE FIRST */
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          padding: 14px;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1100px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* CARD STYLE */
        .card {
          background: #171717;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
          transition: 0.2s;
        }

        .card:hover {
          transform: translateY(-3px);
        }

        /* IMAGE */
        .img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          cursor: pointer;
        }

        /* CONTENT */
        .content {
          padding: 14px;
        }

        h2 {
          margin: 0;
          font-size: 18px;
        }

        .price {
          display: block;
          margin-top: 6px;
          font-size: 18px;
          color: #f2c078;
          font-weight: bold;
        }

        .desc {
          font-size: 13px;
          color: #bbb;
          margin-top: 6px;
          min-height: 40px;
        }

        .time {
          display: block;
          margin-top: 8px;
          font-size: 11px;
          color: #777;
        }

        .buy {
          display: block;
          margin-top: 10px;
          text-align: center;
          padding: 10px;
          background: #8b5e3c;
          border-radius: 10px;
          color: white;
          text-decoration: none;
          font-size: 13px;
        }

        /* MODAL */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modal img {
          max-width: 92%;
          max-height: 92%;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
