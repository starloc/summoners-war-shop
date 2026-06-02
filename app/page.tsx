"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function getAccountAge(date: string) {
  if (!date) return 0;

  const created = new Date(date);
  const today = new Date();

  const diff = today.getTime() - created.getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24));
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

              <p className="account-age">
                Tuổi account: {getAccountAge(acc.account_created_date)} ngày
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

        .header {
          text-align: center;
          padding: 40px 16px 32px;
          background: linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%);
          border-bottom: 1px solid #222;
        }

        .header h1 {
          font-size: 28px;
          margin: 0;
          color: #f2c078;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .header p {
          color: #999;
          font-size: 14px;
          margin: 8px 0 16px;
        }

        .btn {
          display: inline-block;
          padding: 12px 24px;
          background: #f2c078;
          color: #111;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .btn:hover {
          background: #e0b060;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 20px 16px;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 24px 20px;
          }
        }

        @media (min-width: 1100px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .card {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
          transition: border-color 0.2s;
        }

        .card:hover {
          border-color: #3a3a3a;
        }

        .img {
          width: 100%;
          height: 240px;
          object-fit: contain;
          background: #111;
          cursor: pointer;
          padding: 8px;
          box-sizing: border-box;
        }

        .content {
          padding: 16px;
        }

        h2 {
          margin: 0 0 10px;
          font-size: 19px;
          font-weight: 600;
          color: #f2c078;
        }

        .price {
          display: inline-block;
          font-size: 18px;
          color: #4ade80;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .desc {
          font-size: 13px;
          color: #aaa;
          margin: 0 0 12px;
          line-height: 1.5;
          min-height: 36px;
        }

        .account-age {
          font-size: 14px;
          color: #f2c078;
          font-weight: 500;
          margin: 0 0 8px;
        }

        .time {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 12px;
        }

        .buy {
          display: block;
          text-align: center;
          padding: 11px;
          background: #f2c078;
          border-radius: 8px;
          color: #111;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .buy:hover {
          background: #e0b060;
        }

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
