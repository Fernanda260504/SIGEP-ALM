function PermissionTable({ mode }) {
  const permissions = [
    { id: 1, reason: "Medical appointment", date: "2026-02-10", status: "Pending" },
    { id: 2, reason: "Personal matter", date: "2026-02-12", status: "Approved" },
  ];

  return (
    <div>
      <h3>Permission Requests</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Reason</th>
            <th>Date</th>
            <th>Status</th>
            {mode === "approval" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.id}>
              <td>{permission.reason}</td>
              <td>{permission.date}</td>
              <td>{permission.status}</td>

              {mode === "approval" && (
                <td>
                  <button>Approve</button>
                  <button>Reject</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PermissionTable;
