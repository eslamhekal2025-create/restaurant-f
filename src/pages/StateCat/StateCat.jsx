import React from "react";
import { Pie } from "react-chartjs-2";
import { useProduct } from "../../context/productContext.js";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CategoryPieChart = () => {
  const { stateCat } = useProduct();

  if (!stateCat.length) return <p>Loading...</p>;

  const pieData = {
    labels: stateCat.map((i) => i._id),
    datasets: [
      {
        data: stateCat.map((i) => i.count),
        backgroundColor: ["red", "blue", "green", "orange", "purple"],
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
        },
        formatter: (value) => value,
      },
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>عدد المنتجات لكل فئه</h3>
      <Pie data={pieData} options={options} />
    </div>
  );
};

export default CategoryPieChart;
