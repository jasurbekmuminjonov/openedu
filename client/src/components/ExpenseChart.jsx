import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

const ExpensePieChart = ({ expenses }) => {
  const data = useMemo(() => {
    const grouped = {};

    expenses.forEach((item) => {
      const catId = item.expense_category_id._id;
      const catName = item.expense_category_id.expense_category_name;
      const catColor = item.expense_category_id.color || "#999999"; // default agar color bo'lmasa

      if (!grouped[catId]) {
        grouped[catId] = { name: catName, total: 0, color: catColor };
      }
      grouped[catId].total += item.expense_amount;
    });

    return Object.values(grouped);
  }, [expenses]);

  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          label={({ name, total }) =>
            `${name}: ${((total / totalAmount) * 100).toFixed(1)}% (${total.toLocaleString("ru-RU")} UZS)`
          }
        >
          {data.map((item, index) => (
            <Cell key={`cell-${index}`} fill={item.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [
            `${value.toLocaleString("ru-RU")} UZS`,
            `${name}`,
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;
