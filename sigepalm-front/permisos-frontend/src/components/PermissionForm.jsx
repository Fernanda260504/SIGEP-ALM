import { useState } from "react";

function PermissionForm() {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ reason, date });
    alert("Permission request submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Request Permission</h3>

      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default PermissionForm;
