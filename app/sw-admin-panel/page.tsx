"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [monsterName, setMonsterName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [accountDate, setAccountDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("accounts")
      .select("*")
      .order("created_at", { ascending: false });

    setAccounts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (loggedIn) load();
  }, [loggedIn]);

  function login() {
    if (password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Sai mật khẩu");
    }
  }

  async function add() {
    if (!monsterName || !price) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    let url = "";

    if (imageFile) {
      const fileName = Date.now() + "-" + imageFile.name;

      const { error } = await supabase.storage
        .from("accounts")
        .upload(fileName, imageFile);

      if (error) return alert(error.message);

      const { data } = supabase.storage
        .from("accounts")
        .getPublicUrl(fileName);

      url = data.publicUrl;
    }

    await supabase.from("accounts").insert([
      {
        monster_name: monsterName,
        price: Number(price),
        description,
        image_url: url,
        created_at: new Date().toISOString(),
        account_created_date: accountDate,
      },
    ]);

    setMonsterName("");
    setPrice("");
    setDescription("");
    setAccountDate("");
    setImageFile(null);

    load();
  }

  async function del(id: string) {
    if (window.confirm("Bạn có chắc muốn xóa account này?")) {
      await supabase.from("accounts").delete().eq("id", id);
      load();
    }
  }

  // Login Screen
  if (!loggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginIcon}>⚔️</div>
          <h2 style={styles.loginTitle}>Summoners War Admin</h2>
          <p style={styles.loginSubtitle}>Đăng nhập để quản lý</p>
          
          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              style={styles.loginInput}
            />
          </div>

          <button onClick={login} style={styles.loginButton}>
            Đăng Nhập
          </button>
        </div>
      </div>
    );
  }
  
  // Admin Panel  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            ⚔️ Summoners War Admin
          </h1>
          <p style={styles.subtitle}>
            Quản lý account Summoners War
          </p>
        </div>
        
        <div style={styles.statsCard}>
          <div style={styles.statsNumber}>{accounts.length}</div>
          <div style={styles.statsLabel}>Tổng Account</div>
        </div>
      </div>

      {/* Add Form */}
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>➕ Thêm Account Mới</h3>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tên Monster</label>
            <input 
              placeholder="VD: LD Nat 5..."
              value={monsterName}
              onChange={(e) => setMonsterName(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Giá (VND)</label>
            <input 
              placeholder="VD: 500000"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Ngày Tạo Account</label>
            <input
              type="date"
              value={accountDate}
              onChange={(e) => setAccountDate(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Hình Ảnh</label>
            <input 
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) setImageFile(e.target.files[0]);
              }}
              style={styles.fileInput}
            />
            {imageFile && (
              <span style={styles.fileName}>📎 {imageFile.name}</span>
            )}
          </div>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Mô Tả</label>
          <textarea 
            placeholder="Mô tả chi tiết về account..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            rows={3}
          />
        </div>
        
        <button onClick={add} style={styles.addButton}>
          ✨ Thêm Account
        </button>
      </div>

      {/* Accounts List */}
      <div style={styles.listCard}>
        <h3 style={styles.formTitle}>📋 Danh Sách Account</h3>
        
        {loading ? (
          <div style={styles.loading}>Đang tải...</div>
        ) : accounts.length === 0 ? (
          <div style={styles.empty}>Chưa có account nào</div>
        ) : (
          <div style={styles.accountGrid}>
            {accounts.map((a) => (
              <div key={a.id} style={styles.accountCard}>
                {a.image_url && (
                  <img 
                    src={a.image_url} 
                    alt={a.monster_name}
                    style={styles.accountImage}
                  />
                )}
                <div style={styles.accountInfo}>
                  <h4 style={styles.monsterName}>{a.monster_name}</h4>
                  <div style={styles.priceTag}>
                    {a.price?.toLocaleString("vi-VN")} VND
                  </div>
                  {a.description && (
                    <p style={styles.description}>{a.description}</p>
                  )}
                  <div style={styles.meta}>
                    <span style={styles.dateText}>
                      📅 {a.created_at
                        ? new Date(a.created_at).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </span>
                    {a.account_created_date && (
                      <span style={styles.dateText}>
                        🎂 Account: {new Date(a.account_created_date).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => del(a.id)} 
                    style={styles.deleteButton}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  // Login
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    padding: "20px",
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    padding: "50px 40px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  loginIcon: {
    fontSize: "50px",
    marginBottom: "20px",
  },
  loginTitle: {
    color: "#f2c078",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
  },
  loginSubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "14px",
    marginBottom: "30px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  loginInput: {
    width: "100%",
    padding: "14px 18px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s",
    boxSizing: "border-box",
  },
  loginButton: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #f2c078, #e8a84c)",
    color: "#1a1a2e",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(242, 192, 120, 0.3)",
  },
  
  // Main Container
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0b0f14 0%, #1a1f2e 100%)",
    color: "#fff",
    padding: "30px",
    fontFamily: "'Segoe UI', 'Arial', sans-serif",
  },
  
  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    margin: 0,
    color: "#f2c078",
    fontSize: "32px",
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: "5px",
    fontSize: "14px",
  },
  statsCard: {
    background: "linear-gradient(135deg, #1e2433, #252b3a)",
    padding: "20px 30px",
    borderRadius: "16px",
    border: "1px solid rgba(242, 192, 120, 0.2)",
    textAlign: "center",
  },
  statsNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#f2c078",
  },
  statsLabel: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: "5px",
  },
  
  // Form
  formCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "25px",
  },
  formTitle: {
    color: "#f2c078",
    marginBottom: "20px",
    fontSize: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "15px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s",
    boxSizing: "border-box",
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  fileName: {
    display: "block",
    marginTop: "5px",
    color: "#f2c078",
    fontSize: "12px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  addButton: {
    padding: "12px 30px",
    background: "linear-gradient(135deg, #f2c078, #e8a84c)",
    color: "#1a1a2e",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(242, 192, 120, 0.3)",
  },
  
  // List
  listCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "16px",
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "16px",
  },
  accountGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "15px",
  },
  accountCard: {
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s",
  },
  accountImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },
  accountInfo: {
    padding: "15px",
  },
  monsterName: {
    margin: "0 0 10px 0",
    color: "#f2c078",
    fontSize: "18px",
  },
  priceTag: {
    color: "#4ade80",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  description: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "13px",
    lineHeight: "1.6",
    marginBottom: "10px",
  },
  meta: {
    display: "flex",
    gap: "15px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  dateText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "12px",
  },
  deleteButton: {
    width: "100%",
    padding: "8px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s",
  },
};
