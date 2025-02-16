export default function UserTable({ onSelectPdf }) {
  const users = [
    { index: "", name: "Reference Document", designation: "", pdf: "/docs/URS_02_A_Referene_Training_Curriculum.pdf" },
    { index: 1, name: "Prabhat Kumar", designation: "QA Specialist", pdf: "/docs/URS_02_A_Test_Prabhat_training_Record.pdf" },
    { index: 2, name: "Sainath Kumar", designation: "CSV Specialist", pdf: "/docs/URS_02_B_Test_Sainath_training_record.pdf" },
    // ... more users
  ];

  return (
    <table className="w-full border-collapse table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Index</th> {/* New column header */}
          <th className="px-4 py-2 text-left">User Name</th>
          <th className="px-4 py-2 text-left">Designation</th> {/* New column header */}
          <th className="px-4 py-2 text-left">Training Record</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.name}>
            <td className="px-4 py-2 border-b">{user.index}</td>
            <td className="px-4 py-2 border-b">{user.name}</td> {/* User name is back! */}
            <td className="px-4 py-2 border-b">{user.designation}</td>
            <td className="px-4 py-2 border-b">
              <button onClick={() => onSelectPdf(user.pdf)} className="text-blue-500 hover:underline">
                View PDF
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}