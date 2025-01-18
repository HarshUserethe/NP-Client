import { useState, useEffect } from "react";
import { Button, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { createRecord, updateRecord, getRecords } from "../api/api";
import "../App.css";

const DailyTracker = () => {
  const [activeRecord, setActiveRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const weekdays = [7, 6, 6, 6, 6, 7, 7]; // Sunday to Saturday prices

  const loadActiveRecord = async () => {
    const recordsData = await getRecords();
    setRecords(recordsData);
    const active = recordsData.find((rec) => !rec.endDate);
    if (active) setActiveRecord(active);
  };

  const calculateCost = () => {
    const day = new Date().getDay();
    return weekdays[day];
  };

  const updateDailyCost = async () => {
    const todayCost = calculateCost();
    if (activeRecord) {
      const updatedRecord = {
        ...activeRecord,
        totalCost: activeRecord.totalCost + todayCost,
        daysCount: activeRecord.daysCount + 1,
      };
      await updateRecord(activeRecord._id, updatedRecord);
      setActiveRecord(updatedRecord);
    }
  };

  const handleBillPaid = async () => {
    if (activeRecord) {
      await updateRecord(activeRecord._id, { ...activeRecord, endDate: new Date() });
      setActiveRecord(null);
    } else {
      const newRecord = { totalCost: 0, daysCount: 0, deductedDays: [] };
      const created = await createRecord(newRecord);
      setActiveRecord(created);
    }
  };

  const handleNoPaperToday = async () => {
    const dayIndex = new Date().getDay();
    if (activeRecord) {
      if (activeRecord.deductedDays.includes(dayIndex)) {
        alert("Today's cost has already been deducted.");
        return;
      }

      const todayCost = calculateCost();
      const updatedRecord = {
        ...activeRecord,
        totalCost: activeRecord.totalCost - todayCost,
        deductedDays: [...activeRecord.deductedDays, dayIndex],
      };

      await updateRecord(activeRecord._id, updatedRecord);
      setActiveRecord(updatedRecord);
    } else {
      alert("No active record found.");
    }
  };

  useEffect(() => {
    loadActiveRecord();
  }, []);

  return (
    <div className="tracker-container">
      <div className="stats">
        <Typography variant="h6">Total Days: {activeRecord?.daysCount || "00"}</Typography>
        <Typography variant="h6">Total Cost: ₹{activeRecord?.totalCost || 0}</Typography>
      </div>

      <div className="circle">
        <Typography variant="h2">₹{activeRecord?.totalCost || 0}</Typography>
        <Typography variant="subtitle1">Newspaper Cost: ₹{calculateCost()}</Typography>
      </div>

      <Button
        variant="contained"
        className="new-record-btn"
        onClick={handleBillPaid}
      >
        {activeRecord ? "Mark Bill Paid" : "Start New Record"}
      </Button>

      {activeRecord && (
        <Button
          variant="outlined"
          className="no-paper-btn"
          onClick={handleNoPaperToday}
        >
          No Paper Today
        </Button>
      )}

      <div className="records">
        <Typography variant="h5">Records</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.startDate || "-"}</TableCell>
                <TableCell>{record.endDate || "-"}</TableCell>
                <TableCell>₹{record.totalCost}</TableCell>
                <TableCell>{record.daysCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DailyTracker;
