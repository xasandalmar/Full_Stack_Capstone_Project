import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/auth/profile");

        setUser(response.data.user);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Could not load profile"
        );
      }
    };

    getProfile();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();

    formData.append("profilePicture", file);

    try {
      setError("");
      setMessage("");

      const response = await api.post(
        "/upload/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Profile picture updated");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Upload failed"
      );
    }
  };

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          {error ? (
            <div className="error">{error}</div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Profile</h1>

        <div className="profile-card">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <p>No profile picture</p>
          )}

          <p>
            <strong>Username:</strong>{" "}
            {user.username}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Role:</strong> {user.role}
          </p>

          <hr />

          <h3>Change Profile Picture</h3>

          {error && (
            <div className="error">{error}</div>
          )}

          {message && (
            <div className="success">{message}</div>
          )}

          <form onSubmit={handleUpload}>
            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />
            </div>

            <button className="primary-btn">
              Upload Picture
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;