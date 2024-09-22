const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const detailBox = document.getElementById("detail-box");
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  {
    minDegree: 0,
    maxDegree: 30,
    value:
      "Pre Approval: House hunt with confidence! Our new online pre-approval process is convenient, fast, and free—print your letter in minutes and it's valid for 120 days!",
  },
  {
    minDegree: 31,
    maxDegree: 90,
    value:
      "Cooper Cashback: Connect with a top, local real estate agent and you may receive up to $10k cashback when you use the Cooper CashBack program to buy and sell.",
  },
  {
    minDegree: 91,
    maxDegree: 150,
    value:
      "Verified Approval: Making your offer stand out from the competition is fast, easy, and secure. When you're ready to make an offer, we'll verify your financial information to generate your Verified Approval Letter in only hours",
  },
  {
    minDegree: 151,
    maxDegree: 210,
    value:
      "Street Smarts: Mr. Cooper's exclusive platform helps you browse the latest listings, get real-time housing market insights, and set up home alerts. ",
  },
  {
    minDegree: 211,
    maxDegree: 270,
    value:
      "Rate Swap: Don't stress about unpredictable rates. Buy a home now and swap out your rate later with a reduced origination fee.",
  },
  {
    minDegree: 271,
    maxDegree: 330,
    value:
      "Mortgage Markdown: Buy a home with Mr. Cooper and we'll reduce your rate by 1% for the first year on your new home purchase.",
  },
  {
    minDegree: 331,
    maxDegree: 360,
    value:
      "Pre Approval: House hunt with confidence! Our new online pre-approval process is convenient, fast, and free—print your letter in minutes and it's valid for 120 days!",
  },
];
//Size of each piece
//background color for each piece
var pieColors = ["#fff7", "#eee7", "#fff7", "#eee7", "#fff7", "#eee7"];
//Create chart

// Define the image sources (replace with actual paths)
let images = [
  new Image(3000, 30),
  new Image(3000, 30),
  new Image(3000, 30),
  new Image(3000, 30),
  new Image(3000, 30),
  new Image(3000, 30),
];
images[0].src = "./offers/img1.svg";
images[1].src = "./offers/img2.svg";
images[2].src = "./offers/img3.svg";
images[3].src = "./offers/img4.svg";
images[4].src = "./offers/img5.svg";
images[5].src = "./offers/img6.svg";

// Colors and Data for the chart
const data = [16, 16, 16, 16, 16, 16];

const myChart = new Chart(wheel, {
  type: "pie",
  data: {
    labels: ["", "", "", "", "", ""], // Leave labels empty, we'll add images later
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#000",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex], // Placeholder, images will replace this
        font: { size: 24 },
      },
    },
  },
  plugins: [
    {
      // Custom plugin to overlay images on pie chart segments
      afterDraw: (chart) => {
        const ctx = chart.ctx;
        const dataset = chart.data.datasets[0];

        dataset.data.forEach((value, index) => {
          const meta = chart.getDatasetMeta(0);
          const arc = meta.data[index]; // The arc object for this slice
          const midAngle = (arc.startAngle + arc.endAngle) / 2;

          // Calculate the position for the image
          const x = arc.x + (Math.cos(midAngle) * arc.outerRadius) / 2;
          const y = arc.y + (Math.sin(midAngle) * arc.outerRadius) / 2;

          // Adjust for image size (e.g. 30x30 pixels)
          const imageSize = 100;
          ctx.drawImage(
            images[index],
            x - imageSize / 2,
            y - imageSize / 2,
            imageSize,
            imageSize
          );
        });
      },
    },
  ],
});
//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p><b>${i.value.split(":")[0]}</b></p>`;
      detailBox.innerHTML = `<p>${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  playSound("spinSound");
  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  detailBox.innerHTML = ``;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * 356);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

function playSound(soundName) {
  document.getElementById(soundName).currentTime = 0;
  document.getElementById(soundName).play();
}
