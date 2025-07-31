import React from "react";

const items = [
  { name: "Laptop", type: "Electronics", code: "E001", quantity: 5 },
  { name: "Chair", type: "Furniture", code: "F002", quantity: 2 },
  { name: "Pen", type: "Stationery", code: "S003", quantity: 20 },
  { name: "Notebook", type: "Stationery", code: "S004", quantity: 3 },
  { name: "Mouse", type: "Electronics", code: "E005", quantity: 1 },
];

const LOW_QUANTITY_THRESHOLD = 5;

function App() {
  const totalItems = items.length;
  const lowQuantityItems = items.filter(item => item.quantity < LOW_QUANTITY_THRESHOLD);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Inventory Dashboard</h1>
      <div style={{ marginBottom: "2rem" }}>
        <strong>Total Items:</strong> {totalItems} <br />
        <strong>Low Quantity Items:</strong> {lowQuantityItems.length}
      </div>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Type</th>
            <th>Item Code</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.code} style={{ background: item.quantity < LOW_QUANTITY_THRESHOLD ? "#ffe0e0" : "white" }}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.code}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;