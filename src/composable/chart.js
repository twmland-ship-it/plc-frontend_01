import { useColorGenerator } from "@/composable/colors";
import { paramStatisticMethod } from "@/composable/options";
export function useChartDataTransform(rawData, chartType, options) {
  switch (chartType) {
    case "pie":
      return pieChart(rawData, options);
    case "bar":
      return barChart(rawData, options);
    case "line":
      return lineChart(rawData, options);
  }
}

export function useChartOptions() {
  return summaryType;
}

const summaryType = paramStatisticMethod;

function lineChart(rawData, options) {
  const datasets = [];
  const colors = useColorGenerator(rawData.length);
  rawData.forEach((el, idx) => {
    datasets.push({
      label: el.label,
      yAxisID: "y",
      data: el.datas,
      borderColor: el.color || colors[idx],
      backgroundColor: el.color || colors[idx],
    });
  });

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    plugins: {
      datalabels: {
        align: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value;
          },
        },
      },
    },
  };
  return { options: { ...defaultOptions, ...options }, datasets };
}

function barChart(rawData, options) {
  const datasets = [];
  datasets.push({
    label: rawData[0].label,
    data: rawData.map((el) => el.datas),
    backgroundColor: "rgba(255, 128, 0, 0.7)",
    borderColor: "rgba(255, 128, 0, 1)",
    borderWidth: 1,
  });

  const defaultOptions = {
    responsive: true,
    height: 300,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
        },
      },
    },

    elements: {
      bar: {
        borderRadius: 4,
      },
    },
  };
  return {
    options: { ...defaultOptions, ...options },
    datasets,
  };
}

function pieChart(rawData, options) {
  const datasets = [];
  datasets.push({
    label: rawData[0].label,
    data: rawData.map((el) => el.datas),
    backgroundColor: useColorGenerator(rawData.length),
  });

  const defaultOptions = {
    borderWidth: 2,
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        align: "top",
      },
    },
    scales: {
      y: {
        display: false,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };
  return {
    datasets,
    options: {
      ...defaultOptions,
      ...options,
    },
  };
}
