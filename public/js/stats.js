function calculateTotalWeight(data) {
  const totals = [];

  data.forEach((workout) => {
    const workoutTotal = workout.exercises.reduce((total, { type, weight }) => {
      if (type === "resistance") {
        return total + weight;
      }
      return total;
    }, 0);

    totals.push(workoutTotal);
  });

  return totals;
}

function duration(data) {
  let durations = [];
  data.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      durations.push(exercise.duration);
    });
  });

  return durations;
}

function workoutNames(data) {
  let names = [];

  data.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      names.push(exercise.name);
    });
  });

  return names;
}

function colorGenerator() {
  const arr = [
    "#6feb60",
    "#deed5d",
    "#d03f5f",
    "#e8a6f5",
    "#cdded5",
    "#012580",
    "#0c7e82",
    "#00d1a4",
    "#cdded5",
    "#a6ea43",
    "#743924",
    "#538181",
    "26F0F1",
    "4EEFE7",
    "9DEDD3",
    "202A25",
  ];
  return arr;
}

function populateChart(data) {
  const durations = duration(data);
  const pounds = calculateTotalWeight(data);
  const names = workoutNames(data);
  const colors = colorGenerator;

  console.log(durations);
  console.log(pounds);
  console.log(names);

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
        y: {
          beginAtZero: true,
        },
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
          label: "Excercises Performed (Time)",
          backgroundColor: [
            "#6feb60",
            "#deed5d",
            "#d03f5f",
            "#e8a6f5",
            "#cdded5",
            "#012580",
            "#0c7e82",
            "#00d1a4",
            "#cdded5",
            "#a6ea43",
            "#743924",
            "#538181",
            "26F0F1",
            "4EEFE7",
            "9DEDD3",
            "202A25",
          ],
          data: durations,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Excercises Performed (Time)",
      },
    },
  });

  let weightChart = new Chart(weightGraph, {
    type: "doughnut",
    data: {
      labels: names,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: [
            "#6feb60",
            "#deed5d",
            "#d03f5f",
            "#e8a6f5",
            "#cdded5",
            "#012580",
            "#0c7e82",
            "#00d1a4",
            "#cdded5",
            "#a6ea43",
            "#743924",
            "#538181",
            "26F0F1",
            "4EEFE7",
            "9DEDD3",
            "202A25",
          ],
          data: pounds,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Excercises Performed",
      },
    },
  });
}

// get all workout data from back-end
API.getWorkoutsInRange().then(populateChart);
