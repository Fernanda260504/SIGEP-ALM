import PermissionTable from "../components/PermissionTable";

function ManagerApproval() {
  return (
    <div>
      <h1>Manager Approval Panel</h1>
      <PermissionTable mode="approval" />
    </div>
  );
}

export default ManagerApproval;
