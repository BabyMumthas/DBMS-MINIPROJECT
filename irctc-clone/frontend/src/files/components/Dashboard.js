import { Link } from "react-router-dom";

function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/"; // Redirect to login
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/book-ticket">Book Ticket</Link></li>
          <li><Link to="/pnr-search">Find My PNR</Link></li>
          <li><Link to="/train-search">Search Train</Link></li>
        </ul>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
