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
  const [selectedFilter, setSelectedFilter] = useState("all");
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

  // Filter accounts based on search
  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.monster_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <main className="page">
      {/* HERO HEADER */}
      <div className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">⚔️ Premium Accounts</div>
          <h1 className="hero-title">
            Summoners War Shop
          </h1>
          <p className="hero-subtitle">
            Starter • LD • Reroll Accounts chất lượng cao
          </p>
          
          <div className="hero-actions">
            <a className="hero-btn-primary" href="https://zalo.me/0948258616">
              <span>💬</span> Liên hệ Zalo
            </a>
            <a className="hero-btn-secondary" href="#accounts">
              <span>🔍</span> Xem Account
            </a>
          </div>
        </div>
        
        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">{accounts.length}+</div>
            <div className="stat-label">Accounts</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Uy tín</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Hỗ trợ</div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="search-section" id="accounts">
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm account theo tên monster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="result-count">
            {filteredAccounts.length} account
          </div>
        </div>
      </div>

      {/* GRID */}
      {filteredAccounts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Không tìm thấy account</h3>
          <p>Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="grid">
          {filteredAccounts.map((acc) => (
            <div className="card" key={acc.id}>
              {/* Image */}
              <div className="card-image-wrapper">
                {acc.image_url ? (
                  <img
                    src={acc.image_url}
                    className="card-image"
                    onClick={() => setPreview(acc.image_url)}
                    alt={acc.monster_name}
                  />
                ) : (
                  <div className="card-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}
                <div className="card-image-overlay" onClick={() => setPreview(acc.image_url)}>
                  <span>🔍 Xem ảnh</span>
                </div>
              </div>

              {/* Content */}
              <div className="card-content">
                <h2 className="card-title">{acc.monster_name}</h2>

                <div className="card-price">
                  {Number(acc.price).toLocaleString("vi-VN")}₫
                </div>

                {acc.description && (
                  <p className="card-desc">{acc.description}</p>
                )}

                <div className="card-info">
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span className="info-text">
                      {acc.created_at
                        ? new Date(acc.created_at).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </span>
                  </div>
                  
                  {acc.account_created_date && (
                    <div className="info-item">
                      <span className="info-icon">⏰</span>
                      <span className="info-text age">
                        {getAccountAge(acc.account_created_date)} ngày tuổi
                      </span>
                    </div>
                  )}
                </div>

                <a className="buy-button" href="https://zalo.me/0948258616">
                  <span>Mua ngay</span>
                  <span className="buy-arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {preview && (
        <div className="modal" onClick={() => setPreview(null)}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setPreview(null)}>
              ✕
            </button>
            <img src={preview} alt="Preview" />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Summoners War Shop. All rights reserved.</p>
          <div className="footer-links">
            <a href="https://zalo.me/0948258616">Zalo</a>
            <a href="#accounts">Accounts</a>
            <a href="#top">↑ Lên đầu</a>
          </div>
        </div>
      </footer>

      {/* STYLES */}
      <style jsx>{`
        .page {
          background: linear-gradient(135deg, #0b0f14 0%, #1a1f2e 100%);
          color: white;
          min-height: 100vh;
          font-family: 'Segoe UI', 'Arial', sans-serif;
        }

        /* HERO SECTION */
        .hero {
          position: relative;
          text-align: center;
          padding: 60px 20px 40px;
          background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(242, 192, 120, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(242, 192, 120, 0.05) 0%, transparent 50%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(242, 192, 120, 0.15);
          border: 1px solid rgba(242, 192, 120, 0.3);
          border-radius: 20px;
          color: #f2c078;
          font-size: 14px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #f2c078, #e8a84c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 15px 0;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px;
          }
        }

        .hero-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
          margin: 0 0 30px 0;
        }

        .hero-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #f2c078, #e8a84c);
          color: #1a1a2e;
          border-radius: 12px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(242, 192, 120, 0.3);
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(242, 192, 120, 0.4);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 12px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        /* HERO STATS */
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
          position: relative;
          z-index: 1;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 28px;
          font-weight: bold;
          color: #f2c078;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 5px;
        }

        @media (max-width: 768px) {
          .hero-stats {
            gap: 20px;
          }
          
          .stat-number {
            font-size: 22px;
          }
        }

        /* SEARCH SECTION */
        .search-section {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          position: relative;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
        }

        .search-input {
          width: 100%;
          padding: 14px 45px 14px 45px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
        }

        .search-input:focus {
          border-color: #f2c078;
          background: rgba(255, 255, 255, 0.1);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-clear {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .search-clear:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .result-count {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          white-space: nowrap;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          color: #f2c078;
          margin: 0 0 10px 0;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 15px;
            padding: 15px;
          }
        }

        /* CARD */
        .card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .card:hover {
          transform: translateY(-5px);
          border-color: rgba(242, 192, 120, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        /* IMAGE */
        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          cursor: pointer;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .card:hover .card-image {
          transform: scale(1.05);
        }

        .card-image-placeholder {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.3);
          font-size: 16px;
        }

        .card-image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          color: white;
          font-size: 16px;
          font-weight: 500;
        }

        .card-image-wrapper:hover .card-image-overlay {
          opacity: 1;
        }

        /* CONTENT */
        .card-content {
          padding: 18px;
        }

        .card-title {
          margin: 0 0 10px 0;
          font-size: 20px;
          font-weight: 700;
          color: #f2c078;
        }

        .card-price {
          display: inline-block;
          padding: 6px 14px;
          background: linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(74, 222, 128, 0.1));
          border: 1px solid rgba(74, 222, 128, 0.3);
          border-radius: 8px;
          color: #4ade80;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .card-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 15px 0;
          min-height: 40px;
        }

        /* INFO */
        .card-info {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .info-icon {
          font-size: 14px;
        }

        .info-text.age {
          color: #f2c078;
          font-weight: 600;
        }

        /* BUY BUTTON */
        .buy-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #f2c078, #e8a84c);
          border-radius: 10px;
          color: #1a1a2e;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(242, 192, 120, 0.2);
          box-sizing: border-box;
        }

        .buy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(242, 192, 120, 0.3);
        }

        .buy-arrow {
          transition: transform 0.3s;
        }

        .buy-button:hover .buy-arrow {
          transform: translateX(5px);
        }

        /* MODAL */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          position: relative;
          max-width: 90%;
          max-height: 90%;
        }

        .modal-content img {
          max-width: 100%;
          max-height: 90vh;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-close {
          position: absolute;
          top: -15px;
          right: -15px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          color: white;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        /* FOOTER */
        .footer {
          margin-top: 40px;
          padding: 30px 20px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .footer-content p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 20px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: #f2c078;
        }
      `}</style>
    </main>
  );
}
