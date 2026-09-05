import { useEffect, useState } from "react";
import api from "../services/api";
import TransactionForm from "../component/TransactionForm";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      const data =
        response.data.transactions ||
        response.data.data ||
        response.data;

      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const handleTransactionAdded = () => {
    getTransactions();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);

      getTransactions();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete transaction"
      );
    }
  };

  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += Number(transaction.amount);
    }

    if (transaction.type === "expense") {
      totalExpenses += Number(transaction.amount);
    }
  });

  const balance = totalIncome - totalExpenses;

  return (
    <div className="container page">

      {/* Dashboard Header */}

      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>
          Welcome to Personal Finance Tracker
        </p>
      </div>

      {/* Summary */}

      <div className="summary-grid">

        <div className="summary-card income">
          <h3>Total Income</h3>

          <h2>
            ${totalIncome.toFixed(2)}
          </h2>
        </div>

        <div className="summary-card expense">
          <h3>Total Expenses</h3>

          <h2>
            ${totalExpenses.toFixed(2)}
          </h2>
        </div>

        <div className="summary-card">
          <h3>Balance</h3>

          <h2>
            ${balance.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* Add Transaction */}

      <TransactionForm
        onTransactionAdded={handleTransactionAdded}
      />

      {/* Transactions */}

      <div className="transaction-section">

        <h2>Transactions</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (

          <table className="transaction-table">

            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {transactions.map((transaction) => (

                <tr key={transaction._id}>

                  <td>
                    {transaction.title}
                  </td>

                  <td>
                    ${Number(transaction.amount).toFixed(2)}
                  </td>

                  <td>
                    {transaction.type}
                  </td>

                  <td>
                    {transaction.category}
                  </td>

                  <td>
                    {new Date(
                      transaction.date
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(transaction._id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Dashboard;