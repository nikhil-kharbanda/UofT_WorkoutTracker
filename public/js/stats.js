// total weight lifted per workout
function calculateTotalWeight(data) {
  return data.map((workout) =>
    workout.exercises.reduce((total, { type, weight }) => {
      if (type === "resistance") {
        return total + weight;
      }
      return total;
    }, 0)
  );
}

// total minutes per workout
function duration(data) {
  return data.map((workout) => workout.totalDuration);
}

// totals per exercise name across all workouts
function exerciseTotals(data) {
  const totals = {};

  data.forEach((workout) => {
    workout.exercises.forEach(({ name, type, duration, weight }) => {
      if (!totals[name]) {
        totals[name] = { duration: 0, weight: 0 };
      }
      totals[name].duration += duration || 0;
      if (type === "resistance") {
        totals[name].weight += weight || 0;
      }
    });
  });

  return totals;
}

function colorGenerator() {
  return [
    "#6feb60",
    "#deed5d",
    "#d03f5f",
    "#e8a6f5",
    "#cdded5",
    "#012580",
    "#0c7e82",
    "#00d1a4",
    "#a6ea43",
    "#743924",
    "#538181",
    "#26F0F1",
    "#4EEFE7",
    "#9DEDD3",
    "#202A25",
  ];
}

function populateChart(data) {
  const durations = duration(data);
  const pounds = calculateTotalWeight(data);
  const totals = exerciseTotals(data);
  const names = Object.keys(totals);
  const exerciseDurations = names.map((name) => totals[name].duration);
  const exerciseWeights = names.map((name) => totals[name].weight);
  const colors = colorGenerator();

  const line = document.querySelector("#canvas").getContext("2d");
  const bar = document.querySelector("#canvas2").getContext("2d");
  const durationGraph = document.querySelector("#canvas3").getContext("2d");
  const weightGraph = document.querySelector("#canvas4").getContext("2d");

  const labels = data.map(({ day }) => {
    const date = new Date(day);

    // Use JavaScript's `Intl` object to help format dates
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  });

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: durations,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Time Spent Working Out (Last 7 days)",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pounds",
          data: pounds,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Pounds Lifted (Last 7 days)",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  let durationChart = new Chart(durationGraph, {
    type: "polarArea",
    data: {
      labels: names,
      datasets: [
        {
          label: "Exercises Performed (Time)",
          backgroundColor: colors,
          data: exerciseDurations,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Exercises Performed (Minutes)",
      },
    },
  });

  let weightChart = new Chart(weightGraph, {
    type: "doughnut",
    data: {
      labels: names,
      datasets: [
        {
          label: "Exercises Performed",
          backgroundColor: colors,
          data: exerciseWeights,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Exercises Performed (Pounds)",
      },
    },
  });
}

// get all workout data from back-end
API.getWorkoutsInRange().then(populateChart);
