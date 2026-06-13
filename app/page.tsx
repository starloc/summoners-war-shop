"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Danh sách màu accent đẹp
const accentColors = [
  { name: "Vàng", primary: "#f0c060", secondary: "#e0b050", bg: "rgba(240, 192, 96, 0.1)", border: "rgba(240, 192, 96, 0.2)" },
  { name: "Xanh dương", primary: "#58a6ff", secondary: "#4895e0", bg: "rgba(88, 166, 255, 0.1)", border: "rgba(88, 166, 255, 0.2)" },
  { name: "Xanh lá", primary: "#3fb950", secondary: "#2ea043", bg: "rgba(63, 185, 80, 0.1)", border: "rgba(63, 185, 80, 0.2)" },
  { name: "Tím", primary: "#bc8cff", secondary: "#a371f7", bg: "rgba(188, 140, 255, 0.1)", border: "rgba(188, 140, 255, 0.2)" },
  { name: "Hồng", primary: "#f778ba", secondary: "#e060a0", bg: "rgba(247, 120, 186, 0.1)", border: "rgba(247, 120, 186, 0.2)" },
  { name: "Cam", primary: "#f0883e", secondary: "#e07030", bg: "rgba(240, 136, 62, 0.1)", border: "rgba(240, 136, 62, 0.2)" },
  { name: "Đỏ", primary: "#f85149", secondary: "#e04040", bg: "rgba(248, 81, 73, 0.1)", border: "rgba(248, 81, 73, 0.2)" },
  { name: "Cyan", primary: "#39d2c0", secondary: "#30c0b0", bg: "rgba(57, 210, 192, 0.1)", border: "rgba(57, 210, 192, 0.2)" },
];

function formatAccountDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [, forceUpdate] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [accentColor, setAccentColor] = useState(accentColors[0]);

  useEffect(() => {
    // Random màu accent mỗi lần load trang
    const randomColor = accentColors[Math.floor(Math.random() * accentColors.length)];
    setAccentColor(randomColor);
    
    async function load() {
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      setAccounts(data || []);
    }

    load();
    
    // Hiện popup sau khi load xong
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Tự động cập nhật mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const filteredAccounts = accounts
    .filter(acc => 
      acc.monster_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "cheapest") return a.price - b.price;
      if (sortBy === "expensive") return b.price - a.price;
      if (sortBy === "oldest") return new Date(b.account_created_date).getTime() - new Date(a.account_created_date).getTime();
      return 0;
    });

  return (
    <main className="page">
      {/* WELCOME POPUP */}
      {showWelcome && (
        <div className="popup-overlay" onClick={() => setShowWelcome(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">⚔️</div>
            <h2 className="popup-title">Chào mừng đến với HL Shop!</h2>
            <div className="popup-divider"></div>
            <p className="popup-text">
              ⚠️ <strong>Lưu ý:</strong> Sẵn 7 000 - 10 000 điểm event mới. Các tài khoản đều được set ID sẵn (Không dùng tên riêng), cam kết 100% không bị ban.
            </p>
            <button className="popup-btn" onClick={() => setShowWelcome(false)}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">⚔️</span>
            <div>
              <h1>Summoners War Shop</h1>
              <p>Clone sự kiện 12 năm</p>
            </div>
          </div>
          <a className="zalo-btn" href="https://zalo.me/0948258616">
            <span>Liên hệ Zalo</span>
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
            <div className="img-wrapper" onClick={() => setPreview(acc.image_url)}>
              {acc.image_url ? (
                <img src={acc.image_url} alt={acc.monster_name} />
              ) : (
                <div className="no-img">No Image</div>
              )}
              <div className="img-badge">🔍 Xem ảnh</div>
            </div>

            <div className="card-body">
              <h3>{acc.monster_name}</h3>
              
              <div className="price">
                {Number(acc.price).toLocaleString("vi-VN")}₫
              </div>

              {acc.account_code && (
                <div className="account-code">
                  Mã số: {acc.account_code}
                </div>
              )}

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
                    <span className="detail-label">Sách 12 năm:</span>
                    <span className="detail-value">{acc.ancient_transcendence_scroll}</span>
                  </div>
                )}
                
                {acc.ld_scroll !== null && acc.ld_scroll !== undefined && (
                  <div className="detail-item">
                    <span className="detail-icon">✨</span>
                    <span className="detail-label">Sách LnD:</span>
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
                    ⏰ Ngày tạo: {formatAccountDate(acc.account_created_date)}
                  </span>
                )}
              </div>

              <a className="buy-btn" href="https://zalo.me/0948258616">
                Mua ngay
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="empty">
          <p>Không tìm thấy account nào</p>
        </div>
      )}

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

        /* POPUP */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .popup {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 16px;
          padding: 32px 28px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .popup-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .popup-title {
          font-size: 20px;
          color: ${accentColor.primary};
          margin: 0 0 16px;
          font-weight: 700;
        }

        .popup-divider {
          width: 60px;
          height: 2px;
          background: ${accentColor.primary};
          margin: 0 auto 16px;
          border-radius: 1px;
        }

        .popup-text {
          font-size: 14px;
          color: #8b949e;
          line-height: 1.6;
          margin: 0 0 24px;
          text-align: left;
        }

        .popup-text strong {
          color: ${accentColor.primary};
        }

        .popup-btn {
          width: 100%;
          padding: 12px;
          background: ${accentColor.primary};
          color: #0d1117;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .popup-btn:hover {
          background: ${accentColor.secondary};
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
          color: ${accentColor.primary};
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
          border-color: ${accentColor.primary};
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
          color: ${accentColor.primary};
          line-height: 1.3;
        }

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #3fb950;
          margin-bottom: 10px;
        }

        .account-code {
          background: ${accentColor.bg};
          border: 1px solid ${accentColor.border};
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 13px;
          color: ${accentColor.primary};
          font-family: monospace;
          margin-bottom: 10px;
        }

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
          color: ${accentColor.primary};
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

        .empty {
          text-align: center;
          padding: 40px;
          color: #484f58;
        }

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
          color: ${accentColor.primary};
          font-size: 13px;
          text-decoration: none;
        }

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
