import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ token, onLogout }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getProfile = async () => {
    if (!token) {
      alert("No token found");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/profile", {
        headers: {
          Authorization: token
        }
      });

      const data = await res.json();

      if (res.ok) {
        setProfileData(data.user);
      } else {
        alert(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setProfileData(null);
    onLogout();
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageContainer}>
        <div style={styles.form}>
          <h2>Your Profile</h2>

          <div style={styles.tokenInfo}>
            <p>
              <strong>Token:</strong> {token.substring(0, 30)}...
            </p>
          </div>

          <button onClick={getProfile} style={styles.submitButton} disabled={loading}>
            {loading ? "Loading..." : "Fetch Profile"}
          </button>

          {profileData && (
            <div style={styles.profileData}>
              <h3>Profile Information</h3>
              <p>
                <strong>Name:</strong> {profileData.name}
              </p>
              <p>
                <strong>Email:</strong> {profileData.email}
              </p>
            </div>
          )}

          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%"
  },
  pageContainer: {
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
  tokenInfo: {
    backgroundColor: "#e8f5e9",
    padding: "15px",
    borderRadius: "4px",
    wordBreak: "break-all",
    fontSize: "14px"
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
  logoutButton: {
    padding: "10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s"
  },
  profileData: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd"
  }
};

export default Profile;
