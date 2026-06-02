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
  const [sortBy, setSortBy] = useState("newest");

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

  const filteredAccounts = accounts
    .filter(acc => 
      acc.monster_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "cheapest") return a.price - b.price;
      if (sortBy === "expensive") return b.price - a.price;
      if (sortBy === "oldest") return getAccountAge(b.account_created_date) - getAccountAge(a.account_created_date);
      return 0; // newest default
    });

  return (
    <main className="page">
      {/* HEADER */}
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">⚔️</span>
            <div>
              <h1>Summoners War Shop</h1>
              <p>Starter • LD • Reroll Accounts</p>
            </div>
          </div>
          <a className="zalo-btn" href="https://zalo.me/0948258616">
            <span>💬</span> Liên hệ Zalo
          </a>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <div className="toolbar-content">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Tìm account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}>✕</button>
            )}
          </div>
          
          <div className="sort-box">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Acc cũ nhất</option>
              <option value="cheapest">Rẻ nhất</option>
              <option value="expensive">Đắt nhất</option>
            </select>
          </div>
          
          <div className="count">
            {filteredAccounts.length} account
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {filteredAccounts.map((acc) => (
          <div className="card" key={acc.id}>
            {/* Image */}
            <div className="img-wrapper" onClick={() => setPreview(acc.image_url)}>
              {acc.image_url ? (
                <img src={acc.image_url} alt={acc.monster_name} />
              ) : (
                <div className="no-img">No Image</div>
              )}
              <div className="img-badge">🔍 Xem ảnh</div>
            </div>

            {/* Content */}
            <div className="card-body">
              <h3>{acc.monster_name}</h3>
              
              <div className="price">
                {Number(acc.price).toLocaleString("vi-VN")}₫
              </div>

              {/* Account Code */}
              {acc.account_code && (
                <div className="account-code">
                  🔑 {acc.account_code}
                </div>
              )}

              {/* Account Details */}
              <div className="details">
                {acc.wind_phoenix && (
                  <div className="detail-item">
                    <span className="detail-icon">🦅</span>
                    <span className="detail-label">Wind Phoenix:</span>
                    <span className="detail-value">{acc.wind_phoenix}</span>
                  </div>
                )}
                
                {acc.ancient_transcendence_scroll !== null && acc.ancient_transcendence_scroll !== undefined && (
                  <div className="detail-item">
                    <span className="detail-icon">📜</span>
                    <span className="detail-label">Ancient Transcendence:</span>
                    <span className="detail-value">{acc.ancient_transcendence_scroll}</span>
                  </div>
                )}
                
                {acc.ld_scroll !== null && acc.ld_scroll !== undefined && (
                  <div className="detail-item">
                    <span className="detail-icon">✨</span>
                    <span className="detail-label">LD Scroll:</span>
                    <span className="detail-value">{acc.ld_scroll}</span>
                  </div>
                )}
              </div>

              {acc.description && (
                <p className="desc">{acc.description}</p>
              )}

              <div className="meta">
                {acc.account_created_date && (
                  <span className="age">
                    ⏰ Đã tạo được: {getAccountAge(acc.account_created_date)} ngày
                  </span>
                )}
                <span className="date">
                  📅 {acc.created_at
                    ? new Date(acc.created_at).toLocaleDateString("vi-VN")
                    : ""}
                </span>
              </div>

              <a className="buy-btn" href="https://zalo.me/0948258616">
                Mua ngay
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {filteredAccounts.length === 0 && (
        <div className="empty">
          <p>Không tìm thấy account nào</p>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <p>Uy tín - Chất lượng - Hỗ trợ 24/7</p>
        <a href="https://zalo.me/0948258616">Liên hệ qua Zalo</a>
      </div>

      {/* MODAL */}
      {preview && (
        <div className="modal" onClick={() => setPreview(null)}>
          <button className="modal-close" onClick={() => setPreview(null)}>✕</button>
          <img src={preview} alt="Preview" />
        </div>
      )}

      <style jsx>{`
        .page {
          background: #0d1117;
          color: #c9d1d9;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }

        /* HEADER */
        .header {
          background: #161b22;
          border-bottom: 1px solid #21262d;
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 28px;
        }

        .logo h1 {
          font-size: 18px;
          margin: 0;
          color: #f0c060;
          font-weight: 600;
        }

        .logo p {
          font-size: 12px;
          color: #8b949e;
          margin: 2px 0 0;
        }

        .zalo-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #238636;
          color: #fff;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: background 0.15s;
          white-space: nowrap;
        }

        .zalo-btn:hover {
          background: #2ea043;
        }

        /* TOOLBAR */
        .toolbar {
          background: #161b22;
          border-bottom: 1px solid #21262d;
          padding: 12px 0;
        }

        .toolbar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-box span {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
        }

        .search-box input {
          width: 100%;
          padding: 8px 35px 8px 34px;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          color: #c9d1d9;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
        }

        .search-box input:focus {
          border-color: #f0c060;
        }

        .search-box button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #8b949e;
          cursor: pointer;
          font-size: 14px;
          padding: 2px 6px;
        }

        .sort-box select {
          padding: 8px 12px;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          color: #c9d1d9;
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .count {
          font-size: 13px;
          color: #8b949e;
          white-space: nowrap;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 12px;
          }
          
          .toolbar-content {
            flex-wrap: wrap;
          }
          
          .header-content {
            padding: 12px 16px;
          }
          
          .logo h1 {
            font-size: 16px;
          }
        }

        /* CARD */
        .card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.15s;
        }

        .card:hover {
          border-color: #30363d;
        }

        .img-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          background: #0d1117;
          cursor: pointer;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
          box-sizing: border-box;
        }

        .no-img {
          color: #484f58;
          font-size: 14px;
        }

        .img-badge {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px;
          background: rgba(0, 0, 0, 0.75);
          color: #c9d1d9;
          font-size: 12px;
          text-align: center;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .img-wrapper:hover .img-badge {
          opacity: 1;
        }

        .card-body {
          padding: 14px;
        }

        .card-body h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
          color: #f0c060;
          line-height: 1.3;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #3fb950;
          margin-bottom: 10px;
        }

        /* ACCOUNT CODE */
        .account-code {
          background: rgba(240, 192, 96, 0.1);
          border: 1px solid rgba(240, 192, 96, 0.2);
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 13px;
          color: #f0c060;
          font-family: monospace;
          margin-bottom: 10px;
        }

        /* DETAILS */
        .details {
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 6px;
          padding: 10px;
          margin-bottom: 10px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          font-size: 13px;
        }

        .detail-item + .detail-item {
          border-top: 1px solid #21262d;
          margin-top: 4px;
          padding-top: 6px;
        }

        .detail-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .detail-label {
          color: #8b949e;
          flex: 1;
        }

        .detail-value {
          color: #c9d1d9;
          font-weight: 600;
        }

        .desc {
          font-size: 13px;
          color: #8b949e;
          margin: 0 0 12px;
          line-height: 1.5;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .age {
          font-size: 12px;
          color: #f0c060;
        }

        .date {
          font-size: 12px;
          color: #484f58;
        }

        .buy-btn {
          display: block;
          width: 100%;
          padding: 10px;
          background: #238636;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.15s;
          box-sizing: border-box;
        }

        .buy-btn:hover {
          background: #2ea043;
        }

        /* EMPTY */
        .empty {
          text-align: center;
          padding: 40px;
          color: #484f58;
        }

        /* FOOTER */
        .footer {
          text-align: center;
          padding: 32px 16px;
          border-top: 1px solid #21262d;
          margin-top: 40px;
        }

        .footer p {
          color: #8b949e;
          font-size: 13px;
          margin: 0 0 8px;
        }

        .footer a {
          color: #f0c060;
          font-size: 13px;
          text-decoration: none;
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
          padding: 20px;
        }

        .modal img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 4px;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: #21262d;
          border: 1px solid #30363d;
          color: #c9d1d9;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          background: #30363d;
        }
      `}</style>
    </main>
  );
}
