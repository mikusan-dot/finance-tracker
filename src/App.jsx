import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [goal, setGoal] = useState(1000);

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setExpenses([]);
  };

  const addExpense = async () => {
    if (!amount || !note) return;

    await addDoc(collection(db, "expenses"), {
      userId: user.uid,
      amount: Number(amount),
      note,
      createdAt: new Date(),
    });

    setAmount("");
    setNote("");
    fetchExpenses();
  };

  const fetchExpenses = async () => {
    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setExpenses(data);
  };

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  let message = "You're doing great 💪";
  if (total > goal) message = "⚠️ You exceeded your goal!";
  else if (total > goal * 0.7) message = "⚠️ Careful, almost there!";

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h1 style={styles.title}>💸 Finance Tracker</h1>

        {!user ? (
          <button style={styles.loginBtn} onClick={handleLogin}>
            Continue with Google
          </button>
        ) : (
          <>
            <div style={styles.header}>
              <img src={user.photoURL} style={styles.avatar} />
              <h3>{user.displayName}</h3>
            </div>

            <div style={styles.inputs}>
              <input
                style={styles.input}
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                style={styles.input}
                type="text"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button style={styles.addBtn} onClick={addExpense}>
                + Add Expense
              </button>
            </div>

            <div style={styles.summary}>
              <h2>💰 {total} Tk</h2>
              <p>{message}</p>
            </div>

            <input
              style={styles.input}
              type="number"
              placeholder="Set Goal"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
            />

            <div style={styles.list}>
              {expenses.map((exp) => (
                <div key={exp.id} style={styles.item}>
                  <span>{exp.note}</span>
                  <span>{exp.amount} Tk</span>
                </div>
              ))}
            </div>

            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },
  card: {
    backdropFilter: "blur(15px)",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "30px",
    width: "350px",
    color: "white",
    boxShadow: "0 0 30px rgba(0,0,0,0.5)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "15px",
  },
  avatar: {
    width: "60px",
    borderRadius: "50%",
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#1e293b",
    color: "white",
  },
  addBtn: {
    background: "#22c55e",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },
  summary: {
    marginTop: "15px",
    textAlign: "center",
  },
  list: {
    marginTop: "15px",
    maxHeight: "120px",
    overflowY: "auto",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.1)",
    padding: "8px",
    borderRadius: "10px",
    marginBottom: "6px",
  },
  logoutBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};

export default App;