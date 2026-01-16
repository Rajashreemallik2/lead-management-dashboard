import { useEffect, useState } from 'react';

function App() {
  // Login states
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard states
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState('');
  const [analytics, setAnalytics] = useState(null);

  // Fetch leads whenever page or search changes
  useEffect(() => {
    if (!loggedIn) return; // don't fetch if not logged in

    const fetchLeads = async () => {
      try {
        const res = await fetch(
          `https://lead-management-dashboard.onrender.com/api/leads?page=${page}&limit=${limit}&search=${search}`
        );
        const data = await res.json();
        setLeads(data.leads || []);
        setTotal(data.total || 0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchLeads();
  }, [page, search, loggedIn]);

  // Fetch analytics once after login
  useEffect(() => {
    if (!loggedIn) return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('https://lead-management-dashboard.onrender.com/api/leads/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, [loggedIn]);

  // Show login page if not logged in
  if (!loggedIn) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
        />
        <button
          onClick={() => {
            if (email === 'admin@example.com' && password === 'admin123') {
              setLoggedIn(true);
              setLoading(true); // start loading dashboard
            } else {
              alert('Invalid credentials');
            }
          }}
          style={{ padding: '5px 10px' }}
        >
          Login
        </button>
      </div>
    );
  }

  // Show dashboard after login
  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading leads...</h2>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lead Management Dashboard</h1>

      {/* Analytics cards */}
      {analytics && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ border: '1px solid black', padding: '10px', flex: 1 }}>
            <h4>Total Leads</h4>
            <p>{analytics.totalLeads}</p>
          </div>
          <div style={{ border: '1px solid black', padding: '10px', flex: 1 }}>
            <h4>Converted Leads</h4>
            <p>{analytics.convertedLeads}</p>
          </div>
          <div style={{ border: '1px solid black', padding: '10px', flex: 1 }}>
            <h4>Leads by Status</h4>
            {analytics.leadsByStatus.map((item) => (
              <p key={item._id}>
                {item._id}: {item.count}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Search box */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: '5px', width: '300px' }}
        />
      </div>

      {/* Leads table */}
      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.status}</td>
              <td>{lead.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={page * limit >= total}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
