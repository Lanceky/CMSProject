import React, { useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import "./Financials.css";

const Financials = () => {
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [weeklySpending, setWeeklySpending] = useState<number>(0);
  const [profit, setProfit] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("Mon");
  const [salesData, setSalesData] = useState<any>([
    { day: "Mon", sales: 0 },
    { day: "Tue", sales: 0 },
    { day: "Wed", sales: 0 },
    { day: "Thu", sales: 0 },
    { day: "Fri", sales: 0 },
    { day: "Sat", sales: 0 },
    { day: "Sun", sales: 0 },
  ]);
  const [salesInput, setSalesInput] = useState<number>(0);

  const handleSalesInput = (sales: number) => {
    setSalesData(prevData =>
      prevData.map((data: any) =>
        data.day === selectedDay ? { ...data, sales } : data
      )
    );
  };

  const calculateProfit = () => {
    const totalSales = salesData.reduce((sum: number, { sales }: any) => sum + sales, 0);
    if (salesData.every(({ sales }) => sales > 0)) {
      setProfit(totalSales - weeklySpending);
    } else {
      alert("Please ensure all days have sales entered before calculating profit.");
    }
  };

  return (
    <div className="financials-dashboard">
      <h2 className="dashboard-title">Financials Overview</h2>

      {/* Milk Sales Tab */}
      <div>
        <h2 className="dashboard-title">Milk Sales</h2>

        {/* Top Section: Milk Sales */}
        <div>
          <button
            className="primary-button"
            onClick={() => setShowSaleForm(!showSaleForm)}
          >
            Enter This Week’s Milk Sales
          </button>

          {showSaleForm && (
            <div className="milk-sale-form">
              <h4>Enter Weekly Milk Sales</h4>
              <div className="form-group">
                <label>Select Day:</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {salesData.map((item: any) => (
                    <option key={item.day} value={item.day}>
                      {item.day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sales for {selectedDay}:</label>
                <input
                  type="number"
                  value={salesInput}
                  onChange={(e) => setSalesInput(Number(e.target.value))}
                  placeholder="Litres Sold"
                />
              </div>
              <div className="form-actions">
                <button
                  className="primary-button"
                  onClick={() => {
                    handleSalesInput(salesInput);
                    setSalesInput(0); // Reset the input field
                  }}
                >
                  Save
                </button>
                <button
                  className="secondary-button"
                  onClick={() => setShowSaleForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Graph Section */}
        <div>
          <h4>Milk Sales Overview</h4>
          <LineChart
            width={600}
            height={300}
            data={salesData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="sales" stroke="#3a7bd5" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="day" angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>

        {/* Bottom Section: Profit Calculation */}
        <div>
          <h4>Profit Calculation</h4>
          <div className="form-group">
            <label>Weekly Spending (KSH):</label>
            <input
              type="number"
              value={weeklySpending}
              onChange={(e) => setWeeklySpending(Number(e.target.value))}
            />
          </div>
          <button className="primary-button" onClick={calculateProfit}>
            Calculate Profit
          </button>
          {profit !== null && (
            <div className="profit-display">
              <h4>Profit: KSH {profit}</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financials;
