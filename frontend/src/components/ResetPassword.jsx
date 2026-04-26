import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Email and both password fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successfully. Redirecting to login...");
        setForm({ email: "", password: "", confirmPassword: "" });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(data.message || "Unable to reset password. Please try again.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2>Reset Password</h2>
        {error && <div style={styles.alert}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="New password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          style={styles.input}
        />
        <button onClick={resetPassword} style={styles.submitButton} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        <p style={styles.switchText}>
          Remembered your password? <Link to="/login" style={styles.link}>Back to login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif"
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s"
  },
  switchText: {
    fontSize: "14px",
    textAlign: "center",
    margin: "10px 0 0 0"
  },
  link: {
    color: "#4CAF50",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline"
  },
  alert: {
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#fdecea",
    color: "#b02a37",
    border: "1px solid #f5c2c7"
  },
  success: {
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#e6ffed",
    color: "#216e39",
    border: "1px solid #b7eb8f"
  }
};

export default ResetPassword;
