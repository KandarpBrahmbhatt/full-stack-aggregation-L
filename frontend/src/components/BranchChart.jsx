// import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const BranchChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Merge all branches data into one chart
  const classMap = {};

  data.forEach((branch) => {
    branch.classes.forEach((cls) => {
      if (!classMap[cls.class]) {
        classMap[cls.class] = 0;
      }
      classMap[cls.class] += cls.students;
    });
  });

  const labels = Object.keys(classMap);
  const values = Object.values(classMap);

  // const barData = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "Students per Class",
  //       data: values,
  //       backgroundColor: "rgba(75,192,192,0.6)",
  //     },
  //   ],
  // };

  const pieData = {
    labels,
    datasets: [
      {
        label: "Distribution",
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ margin: "0px 535px" }}>Student Analytics</h2>

      {/* <div style={{ maxWidth: "700px", margin: "auto" }}>
        <Bar data={barData} />
      </div> */}

      <div style={{ maxWidth: "500px", margin: "40px auto" }}>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default BranchChart;