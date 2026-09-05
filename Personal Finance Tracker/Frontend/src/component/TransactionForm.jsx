import { useState } from "react";
import api from "../services/api";

function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: "",
  });

  const [error, setError] = useState("");

  const categories = [
    "Food",
    "Salary",
    "Rent",
    "Utilities",
    "Entertainment",
    "Transport",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await api.post(
        "/transactions",
        {
          ...formData,
          amount: Number(formData.amount),
        }
      );

      onTransactionAdded(response.data.transaction);

      setFormData({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Could not add transaction"
      );
    }
  };

  return (
    <div className="transaction-form">
      <h2>Add Transaction</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="transaction-form-grid">
          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>

            <input
              type="number"
              name="amount"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button className="primary-btn">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;