import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  const API = "http://localhost:5000/transactions";

  // GET transactions
  const getTransactions = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  // ADD transaction
  const addTransaction = async () => {
    if (!text || !amount) return;

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        amount: Number(amount),
      }),
    });

    setText("");
    setAmount("");
    getTransactions();
  };

  // DELETE transaction
  const deleteTransaction = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getTransactions();
  };

  // CALCULATIONS
  const balance = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  const income = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  const expense = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  // CHART DATA
  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, Math.abs(expense)],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold mb-6">💰 Finance Tracker</h1>

      {/* Balance Card */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center w-80 mb-6">
        <p className="text-gray-400">Current Balance</p>
        <h2 className="text-3xl font-bold text-green-400">
          ${balance}
        </h2>

        {/* Income & Expense */}
        <div className="flex gap-4 mt-4">
          <div className="bg-green-700 p-4 rounded-lg text-center w-36">
            <p>Income</p>
            <h3>${income}</h3>
          </div>

          <div className="bg-red-700 p-4 rounded-lg text-center w-36">
            <p>Expense</p>
            <h3>${Math.abs(expense)}</h3>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-80 mb-6">
        <input
          type="text"
          placeholder="Enter description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 rounded text-black mb-3"
        />

        <input
          type="number"
          placeholder="Enter amount (+income / -expense)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded text-black mb-3"
        />

        <button
          onClick={addTransaction}
          className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </div>

      {/* Transactions */}
      <div className="w-80">
        <h2 className="mb-3 text-lg">Transactions</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className={`flex justify-between items-center p-3 mb-2 rounded-lg ${
                tx.amount > 0 ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <span>
                {tx.text} - {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount)}
              </span>

              <button
                onClick={() => deleteTransaction(tx._id)}
                className="bg-black px-2 rounded"
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      {/* Chart */}
      <div className="w-80 mt-6">
        <h2 className="mb-3 text-lg">Overview</h2>
        <Pie data={chartData} />
      </div>

    </div>
  );
}

export default App;