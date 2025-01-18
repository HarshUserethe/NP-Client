import React from "react";
import DailyTracker from "./components/DailyTracker";
import RecordTable from "./components/RecordTable";

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <DailyTracker />
      <RecordTable />
    </div>
  );
};

export default App;
