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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.monster_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <main className="page">
      {/* HEADER */}
      <div className="header">
        <h1>Summoners War Shop</h1>
        <p>Starter • LD • Reroll Accounts</p>
        <a className="zalo-btn" href="https://zalo.me/0948258616">
          Liên hệ Zalo
        </a>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm account..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="account-list">
        {filteredAccounts.map((acc) => (
          <div className="account-card" key={acc.id}>
            {acc.image_url ? (
              <img
                src={acc.image_url}
                onClick={() => setPreview(acc.image_url)}
                alt={acc.monster_name}
              />
            ) : (
              <div className="no-img">No Image</div>
            )}

            <div className="info">
              <h2>{acc.monster_name}</h2>
              <span className="price">
                {Number(acc.price).toLocaleString("vi-VN")}₫
              </span>

              {acc.description && <p>{acc.description}</p>}

              {acc.account_created_date && (
                <span className="age">
                  Tuổi acc: {getAccountAge(acc.account_created_date)} ngày
                </span>
              )}

              <a className="buy-btn" href="https://zalo.me/0948258616">
                Mua ngay
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW */}
      {preview && (
        <div className="preview" onClick={() => setPreview(null)}>
          <span className="close" onClick={() => setPreview(null)}>✕</span>
          <img src={preview} alt="Preview" />
        </div>
      )}

      <style jsx>{`
        .page {
          background: #0e0e0e;
          color: #e0e0e0;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .header {
          text-align: center;
          padding: 32px 16px 24px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .header h1 {
          font-size: 24px;
          margin: 0;
          color: #f2c078;
          font-weight: 600;
        }

        .header p {
          color: #888;
          font-size: 13px;
          margin: 6px 0 12px;
        }

        .zalo-btn {
          display: inline-block;
          padding: 10px 18px;
          background: #f2c078;
          color: #111;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .search-bar {
          padding: 12px 16px;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-bar input {
          width: 100%;
          padding: 10px 14px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #e0e0e0;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .search-bar input:focus {
          border-color: #f2c078;
        }

        .account-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          padding: 16px;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .account-list {
            grid-template-columns: 1fr;
          }
        }

        .account-card {
          background: #171717;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #262626;
        }

        .account-card img {
          width: 100%;
          height: 260px;
          object-fit: contain;
          background: #1a1a1a;
          cursor: pointer;
          padding: 8px;
          box-sizing: border-box;
        }

        .no-img {
          width: 100%;
          height: 260px;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          font-size: 14px;
        }

        .info {
          padding: 14px;
        }

        .info h2 {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
          color: #f2c078;
        }

        .price {
          display: inline-block;
          font-size: 17px;
          font-weight: 700;
          color: #4ade80;
          margin-bottom: 8px;
        }

        .info p {
          color: #999;
          font-size: 13px;
          margin: 0 0 10px;
          line-height: 1.5;
        }

        .age {
          display: block;
          font-size: 13px;
          color: #f2c078;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .buy-btn {
          display: block;
          text-align: center;
          padding: 10px;
          background: #f2c078;
          color: #111;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .preview {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .preview img {
          max-width: 92%;
          max-height: 92%;
          border-radius: 8px;
        }

        .close {
          position: absolute;
          top: 20px;
          right: 24px;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          background: rgba(255,255,255,0.15);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </main>
  );
}
