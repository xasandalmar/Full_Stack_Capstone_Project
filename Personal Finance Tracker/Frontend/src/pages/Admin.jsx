import { useEffect, useState } from "react";
import api from "../services/api";

function Admin() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOverview = async () => {
      try {
        const response = await api.get(
          "/admin/overview"
        );

        setOverview(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Could not load admin overview"
        );
      }
    };

    getOverview();
  }, []);

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Admin Overview</h1>

        <div className="admin-grid">
          <div className="admin-card">
            <h3>Total Users</h3>
            <p>{overview.totalUsers}</p>
          </div>

          <div className="admin-card">
            <h3>Total Transactions</h3>
            <p>{overview.totalTransactions}</p>
          </div>

          <div className="admin-card">
            <h3>Total Income</h3>
            <p>
              ${Number(
                overview.totalIncome || 0
              ).toFixed(2)}
            </p>
          </div>

          <div className="admin-card">
            <h3>Total Expenses</h3>
            <p>
              ${Number(
                overview.totalExpenses || 0
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;