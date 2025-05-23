import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { apiRequest } from "../../api/api";

export default function MyFinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFines() {
      setLoading(false);
      const me = await apiRequest('/users/me').then(r => r.json());
      const finesData = await apiRequest(`/fines/${me._id}`).then(r => r.json());
      setFines(finesData || []);
      setLoading(false);
    }
    fetchFines();
  }, []);

  if (loading) return <div>Завантаження…</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active="my-fines" />
      <div style={{ flex: 1, background: "#f5f6fa", padding: "2rem" }}>
        <h3 className="mb-4">Мої штрафи</h3>
        {fines.length === 0 ? (
          <div className="text-muted">Немає штрафів</div>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Сума</th>
                <th>Причина</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {fines.map(fine => (
                <tr key={fine._id}>
                  <td>{fine.amount} грн</td>
                  <td>{fine.reason}</td>
                  <td>
                    {fine.paid ? (
                      <span className="badge bg-success">Сплачено</span>
                    ) : (
                      <span className="badge bg-danger">Не сплачено</span>
                    )}
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

