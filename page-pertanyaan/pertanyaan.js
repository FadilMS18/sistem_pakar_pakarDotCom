const questions = [
  "Apakah komputer tidak bisa menyala?",
  "Apakah terdapat suara beep saat dinyalakan?",
  "Apakah tampilan monitor tidak muncul?",
  "Apakah komputer sering restart sendiri?",
  "Apakah komputer berjalan sangat lambat?",
];

let index = 0;
let answers = [];

class ReturnAnswer {
  constructor(questions, answer) {
    this.question = questions;
    this.answer = answer;
  }
}

const box = document.getElementById("questionBox");
const progress = document.getElementById("progressBar");
function loadQuestion() {
  box.innerHTML = questions[index];
  progress.style.width = (index / questions.length) * 100 + "%";
}

function answer(input) {
  let currentAnswer = new ReturnAnswer(questions[index], input);
  answers.push(currentAnswer);

  index++;

  if (index < questions.length) {
    loadQuestion();
  } else {
    progress.style.width = "100%";
    showResult();
  }
}

function showResult() {
  box.innerHTML = `
            <strong>Data sudah terkumpul!</strong><br><br>
            Sistem sedang menganalisis gejala...
        `;

  //   setTimeout(() => {
  //     alert("Analisis selesai! (di sini nanti tampilkan hasil diagnosa)");
  //   }, 1200);
  console.log(answers);
}

loadQuestion();
