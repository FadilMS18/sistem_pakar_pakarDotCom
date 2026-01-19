let questions = [];
let kerusakanData = [];
let relasiData = [];

// Fungsi untuk mengambil semua data yang diperlukan
async function ambilSemuaData() {
  try {
    // Ambil data gejala
    const responseGejala = await fetch("http://localhost:3000/api/gejala");
    const dataGejala = await responseGejala.json();
    
    // Urutkan berdasarkan kode gejala (G1, G2, G3, ... G25)
    dataGejala.sort((a, b) => {
      const numA = parseInt(a.kd_gejala.replace('G', ''));
      const numB = parseInt(b.kd_gejala.replace('G', ''));
      return numA - numB;
    });
    
    questions = dataGejala.map((gejala, index) => ({
      id: index + 1,
      kode_gejala: gejala.kd_gejala,
      text: `Apakah ${gejala.nama_gejala}?`,
      options: ["Ya", "Tidak"],
    }));

    // Ambil data kerusakan
    const responseKerusakan = await fetch("http://localhost:3000/api/kerusakan");
    kerusakanData = await responseKerusakan.json();

    // Ambil data relasi
    const responseRelasi = await fetch("http://localhost:3000/api/relasi");
    relasiData = await responseRelasi.json();

    console.log("Data berhasil dimuat:", {
      gejala: questions.length,
      kerusakan: kerusakanData.length,
      relasi: relasiData.length
    });
    
    console.log("Urutan pertanyaan:", questions.map(q => q.kode_gejala).join(', '));

    renderQuestion();
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    alert("Terjadi kesalahan saat memuat data. Pastikan server berjalan.");
  }
}

let currentQuestion = 0;
let answers = [];

function updateProgress() {
  const progress = (currentQuestion / questions.length) * 100;
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  progressFill.style.width = progress + "%";
  progressText.textContent = `${currentQuestion} dari ${questions.length}`;
}

function createQuestionCard(question, questionIndex) {
  const card = document.createElement("div");
  card.className = "question-card";
  card.id = "current-question-card";

  const questionNumber = document.createElement("div");
  questionNumber.className = "question-number";
  questionNumber.textContent = `PERTANYAAN ${questionIndex + 1} dari ${questions.length}`;
  card.appendChild(questionNumber);

  const questionText = document.createElement("div");
  questionText.className = "question-text";
  questionText.textContent = question.text;
  card.appendChild(questionText);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "options-container";
  
  // Buat tombol opsi langsung di sini
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-button";

    // Tandai jika sudah ada jawaban sebelumnya
    if (answers[questionIndex] && answers[questionIndex].jawaban === option) {
      button.classList.add("selected");
    }

    const span = document.createElement("span");
    span.textContent = option;
    button.appendChild(span);

    button.addEventListener("click", () => selectOption(index, option, button));

    optionsContainer.appendChild(button);
  });
  
  card.appendChild(optionsContainer);

  return card;
}

function createNavigationButtons() {
  const navButtons = document.createElement("div");
  navButtons.className = "navigation-buttons";
  navButtons.id = "nav-buttons";

  const backButton = document.createElement("button");
  backButton.className = "nav-button btn-back";
  backButton.id = "back-button";
  backButton.textContent = "← Kembali";
  backButton.addEventListener("click", previousQuestion);

  const nextButton = document.createElement("button");
  nextButton.className = "nav-button btn-next";
  nextButton.id = "next-button";
  nextButton.disabled = true;
  nextButton.addEventListener("click", nextQuestion);

  navButtons.appendChild(backButton);
  navButtons.appendChild(nextButton);

  return navButtons;
}

function renderQuestion() {
  if (questions.length === 0) {
    console.log("Questions belum tersedia");
    return;
  }
  
  const container = document.getElementById("question-container");
  
  // Cek apakah container ada
  if (!container) {
    console.error("Element 'question-container' tidak ditemukan!");
    return;
  }

  if (currentQuestion >= questions.length) {
    redirectToHasil();
    return;
  }

  console.log("Rendering question:", currentQuestion + 1, "of", questions.length);

  // Clear container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const question = questions[currentQuestion];

  // Create question card dengan konten lengkap
  const questionCard = createQuestionCard(question, currentQuestion);
  container.appendChild(questionCard);

  // Create and add navigation buttons
  const navButtons = createNavigationButtons();
  container.appendChild(navButtons);

  // Update back button visibility
  const backButton = document.getElementById("back-button");
  if (backButton) {
    if (currentQuestion === 0) {
      backButton.style.visibility = "hidden";
    } else {
      backButton.style.visibility = "visible";
    }
  }

  // Update next button
  const nextButton = document.getElementById("next-button");
  if (nextButton) {
    if (answers[currentQuestion]) {
      nextButton.disabled = false;
    }
    
    if (currentQuestion === questions.length - 1) {
      nextButton.textContent = "Lihat Hasil →";
    } else {
      nextButton.textContent = "Lanjut →";
    }
  }

  updateProgress();
}

function selectOption(index, value, clickedButton) {
  const buttons = document.querySelectorAll(".option-button");
  buttons.forEach((btn) => btn.classList.remove("selected"));
  clickedButton.classList.add("selected");

  answers[currentQuestion] = {
    kode_gejala: questions[currentQuestion].kode_gejala,
    jawaban: value
  };

  const nextButton = document.getElementById("next-button");
  nextButton.disabled = false;
}

function nextQuestion() {
  if (answers[currentQuestion]) {
    currentQuestion++;
    renderQuestion();
  }
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

// Fungsi untuk menghitung diagnosa berdasarkan metode forward chaining
function hitungDiagnosa() {
  // Filter gejala yang dijawab "Ya"
  const gejalaYa = answers
    .filter(a => a.jawaban === "Ya")
    .map(a => a.kode_gejala);

  const totalPertanyaan = answers.length;
  const jumlahYa = gejalaYa.length;
  const jumlahTidak = totalPertanyaan - jumlahYa;

  console.log("Gejala yang dijawab Ya:", gejalaYa);
  console.log(`Statistik: ${jumlahYa} Ya, ${jumlahTidak} Tidak dari ${totalPertanyaan} pertanyaan`);

  // EDGE CASE 1: Semua dijawab TIDAK
  if (gejalaYa.length === 0) {
    return {
      kd_kerusakan: "NORMAL",
      nama_kerusakan: "Tidak Ada Kerusakan Terdeteksi",
      keterangan: "Berdasarkan gejala yang Anda jawab, komputer Anda tidak menunjukkan tanda-tanda kerusakan apapun.",
      solusi: "Komputer Anda dalam kondisi baik. Lakukan perawatan rutin seperti membersihkan debu, update software, dan backup data secara berkala.",
      confidence: 100
    };
  }

  // EDGE CASE 2: Semua dijawab YA (kemungkinan user tidak jujur/salah input)
  if (jumlahYa === totalPertanyaan) {
    console.warn("⚠️ WARNING: User menjawab YA untuk SEMUA gejala!");
    
    return {
      kd_kerusakan: "INVALID",
      nama_kerusakan: "Data Diagnosa Tidak Valid",
      keterangan: "Anda menjawab 'Ya' untuk semua gejala kerusakan. Hal ini sangat tidak mungkin terjadi pada satu komputer secara bersamaan. Kemungkinan ada kesalahan dalam menjawab pertanyaan.",
      solusi: "Silakan ulangi diagnosa dengan lebih teliti. Jawab 'Ya' hanya untuk gejala yang benar-benar Anda alami. Jika Anda mengalami banyak masalah sekaligus, sebaiknya konsultasikan langsung dengan teknisi profesional untuk pemeriksaan menyeluruh.",
      confidence: 0,
      isInvalid: true
    };
  }

  // EDGE CASE 3: Hampir semua dijawab YA (>80%)
  const persentaseYa = (jumlahYa / totalPertanyaan) * 100;
  if (persentaseYa > 80) {
    console.warn(`⚠️ WARNING: ${persentaseYa.toFixed(1)}% gejala dijawab YA (sangat tinggi!)`);
    
    // Tetap lakukan diagnosa tapi beri peringatan
    const hasilDiagnosa = lakukanDiagnosa(gejalaYa);
    
    // Modifikasi hasil untuk menambah peringatan
    if (hasilDiagnosa.diagnosaUtama) {
      hasilDiagnosa.diagnosaUtama = {
        ...hasilDiagnosa.diagnosaUtama,
        keterangan: `⚠️ PERHATIAN: Anda mengalami ${jumlahYa} dari ${totalPertanyaan} gejala (${persentaseYa.toFixed(0)}%). Ini menunjukkan kerusakan yang sangat kompleks. ${hasilDiagnosa.diagnosaUtama.keterangan}`,
        solusi: `Karena banyaknya gejala yang muncul, sangat disarankan untuk SEGERA membawa komputer ke teknisi profesional untuk pemeriksaan menyeluruh. ${hasilDiagnosa.diagnosaUtama.solusi}`,
        isHighRisk: true
      };
    } else {
      hasilDiagnosa.keterangan = `⚠️ PERHATIAN: Anda mengalami ${jumlahYa} dari ${totalPertanyaan} gejala (${persentaseYa.toFixed(0)}%). Ini menunjukkan kerusakan yang sangat kompleks. ${hasilDiagnosa.keterangan}`;
      hasilDiagnosa.solusi = `Karena banyaknya gejala yang muncul, sangat disarankan untuk SEGERA membawa komputer ke teknisi profesional untuk pemeriksaan menyeluruh. ${hasilDiagnosa.solusi}`;
      hasilDiagnosa.isHighRisk = true;
    }
    
    return hasilDiagnosa;
  }

  // Normal case: lakukan diagnosa biasa
  return lakukanDiagnosa(gejalaYa);
}

// Fungsi helper untuk melakukan diagnosa normal
function lakukanDiagnosa(gejalaYa) {
  // Cari SEMUA kerusakan yang SEMUA gejalanya cocok (Forward Chaining)
  const diagnosaList = [];

  kerusakanData.forEach(kerusakan => {
    // Ambil semua gejala yang terkait dengan kerusakan ini dari tabel relasi
    const gejalaKerusakan = relasiData
      .filter(r => r.kd_kerusakan === kerusakan.kd_kerusakan)
      .map(r => r.kd_gejala);

    console.log(`${kerusakan.kd_kerusakan} (${kerusakan.nama_kerusakan}) membutuhkan gejala:`, gejalaKerusakan);

    // Cek apakah SEMUA gejala kerusakan ada dalam jawaban Ya user
    const semuaGejalaAda = gejalaKerusakan.every(gejala => 
      gejalaYa.includes(gejala)
    );

    const jumlahCocok = gejalaKerusakan.length;

    // Forward Chaining: Hanya masukkan jika SEMUA gejala terpenuhi
    if (semuaGejalaAda) {
      console.log(`✅ ${kerusakan.kd_kerusakan} COCOK 100%!`);
      
      diagnosaList.push({
        ...kerusakan,
        jumlahCocok: jumlahCocok,
        totalGejala: jumlahCocok,
        confidence: 100,
        gejalaMatch: gejalaKerusakan,
        gejalaDibutuhkan: gejalaKerusakan
      });
    }
  });

  console.log(`Total diagnosa yang cocok 100%: ${diagnosaList.length}`, diagnosaList);

  // Jika ada diagnosa yang cocok 100%
  if (diagnosaList.length > 0) {
    // ============================================================
    // PERUBAHAN UTAMA: Urutkan berdasarkan kode kerusakan (J1-J17)
    // ============================================================
    diagnosaList.sort((a, b) => {
      const numA = parseInt(a.kd_kerusakan.replace('J', ''));
      const numB = parseInt(b.kd_kerusakan.replace('J', ''));
      return numA - numB; // J1, J2, J3, ... J17
    });
    
    console.log("Urutan diagnosa setelah sorting:", diagnosaList.map(d => d.kd_kerusakan).join(', '));
    
    // Diagnosa utama = yang pertama berdasarkan urutan database
    const diagnosaUtama = diagnosaList[0];
    
    // Diagnosa lainnya = sisanya
    const diagnosaLainnya = diagnosaList.slice(1);
    
    // Jika ada multiple diagnosa, return keduanya
    if (diagnosaLainnya.length > 0) {
      console.log("⚠️ MULTIPLE DIAGNOSIS DETECTED!");
      console.log("Diagnosa Utama:", diagnosaUtama.nama_kerusakan, `(${diagnosaUtama.kd_kerusakan})`);
      console.log("Diagnosa Lainnya:", diagnosaLainnya.map(d => `${d.nama_kerusakan} (${d.kd_kerusakan})`));
      
      return {
        diagnosaUtama: diagnosaUtama,
        diagnosaLainnya: diagnosaLainnya
      };
    }
    
    // Jika hanya 1 diagnosa
    return diagnosaUtama;
  }

  // Jika tidak ada yang cocok 100%, cari yang paling mendekati
  const diagnosaParsial = [];

  kerusakanData.forEach(kerusakan => {
    const gejalaKerusakan = relasiData
      .filter(r => r.kd_kerusakan === kerusakan.kd_kerusakan)
      .map(r => r.kd_gejala);

    const gejalaCocok = gejalaKerusakan.filter(g => gejalaYa.includes(g));
    const jumlahCocok = gejalaCocok.length;
    const totalGejalaKerusakan = gejalaKerusakan.length;

    // Minimal harus ada 1 gejala yang cocok
    if (jumlahCocok > 0) {
      const confidence = Math.round((jumlahCocok / totalGejalaKerusakan) * 100);
      
      diagnosaParsial.push({
        ...kerusakan,
        jumlahCocok: jumlahCocok,
        totalGejala: totalGejalaKerusakan,
        confidence: confidence,
        gejalaMatch: gejalaCocok,
        gejalaDibutuhkan: gejalaKerusakan
      });
    }
  });

  if (diagnosaParsial.length > 0) {
    // Urutkan berdasarkan confidence tertinggi, lalu jumlah cocok terbanyak
    diagnosaParsial.sort((a, b) => {
      if (b.confidence === a.confidence) {
        return b.jumlahCocok - a.jumlahCocok;
      }
      return b.confidence - a.confidence;
    });

    const hasil = diagnosaParsial[0];
    
    return {
      ...hasil,
      nama_kerusakan: `Kemungkinan ${hasil.nama_kerusakan}`,
      keterangan: `${hasil.keterangan} Namun diagnosis tidak pasti karena tidak semua gejala terpenuhi.`,
      solusi: `${hasil.solusi} Disarankan untuk konsultasi dengan teknisi untuk pemeriksaan lebih lanjut.`
    };
  }

  // Jika benar-benar tidak ada kecocokan
  return {
    kd_kerusakan: "UNKNOWN",
    nama_kerusakan: "Gejala Tidak Cocok dengan Pola Kerusakan",
    keterangan: "Gejala yang Anda alami tidak sesuai dengan pola kerusakan yang ada dalam sistem.",
    solusi: "Silakan konsultasikan dengan teknisi komputer untuk pemeriksaan lebih detail.",
    confidence: 0
  };
}

function createResultCard(diagnosaUtama, diagnosaLainnya = []) {
  const resultCard = document.createElement("div");
  resultCard.className = "result-card";

  // Icon berdasarkan confidence
  const resultIcon = document.createElement("div");
  resultIcon.className = "result-icon";
  if (diagnosaUtama.confidence >= 70) {
    resultIcon.textContent = "⚠️";
  } else if (diagnosaUtama.confidence >= 40) {
    resultIcon.textContent = "⚡";
  } else {
    resultIcon.textContent = "✅";
  }
  resultCard.appendChild(resultIcon);

  const resultTitle = document.createElement("div");
  resultTitle.className = "result-title";
  resultTitle.textContent = "Hasil Diagnosa";
  resultCard.appendChild(resultTitle);

  // Jika ada multiple diagnosa
  if (diagnosaLainnya.length > 0) {
    const multipleWarning = document.createElement("div");
    multipleWarning.style.backgroundColor = "#fff3cd";
    multipleWarning.style.color = "#856404";
    multipleWarning.style.padding = "12px";
    multipleWarning.style.borderRadius = "8px";
    multipleWarning.style.marginBottom = "15px";
    multipleWarning.style.fontSize = "14px";
    multipleWarning.style.border = "1px solid #ffc107";
    multipleWarning.textContent = `⚠️ Terdeteksi ${diagnosaLainnya.length + 1} kemungkinan kerusakan berdasarkan gejala Anda`;
    resultCard.appendChild(multipleWarning);
  }

  // Diagnosa Utama
  const mainDiagnosisLabel = document.createElement("div");
  mainDiagnosisLabel.style.fontSize = "14px";
  mainDiagnosisLabel.style.fontWeight = "600";
  mainDiagnosisLabel.style.color = "#6c757d";
  mainDiagnosisLabel.style.marginBottom = "5px";
  mainDiagnosisLabel.textContent = diagnosaLainnya.length > 0 ? "DIAGNOSA UTAMA:" : "DIAGNOSA:";
  resultCard.appendChild(mainDiagnosisLabel);

  // Nama kerusakan utama
  const resultDiagnosis = document.createElement("div");
  resultDiagnosis.className = "result-diagnosis";
  resultDiagnosis.style.fontSize = "24px";
  resultDiagnosis.style.fontWeight = "bold";
  resultDiagnosis.style.color = "#2c3e50";
  resultDiagnosis.style.marginBottom = "10px";
  resultDiagnosis.textContent = diagnosaUtama.nama_kerusakan;
  resultCard.appendChild(resultDiagnosis);

  // Confidence level
  if (diagnosaUtama.confidence > 0) {
    const confidenceDiv = document.createElement("div");
    confidenceDiv.style.fontSize = "16px";
    confidenceDiv.style.color = "#7f8c8d";
    confidenceDiv.style.marginBottom = "15px";
    confidenceDiv.textContent = `Tingkat Keyakinan: ${diagnosaUtama.confidence}% (${diagnosaUtama.jumlahCocok}/${diagnosaUtama.totalGejala} gejala cocok)`;
    resultCard.appendChild(confidenceDiv);
  }

  // Keterangan
  const resultDescription = document.createElement("div");
  resultDescription.className = "result-description";
  resultDescription.style.marginBottom = "15px";
  resultDescription.textContent = diagnosaUtama.keterangan || "-";
  resultCard.appendChild(resultDescription);

  // Solusi
  const solutionTitle = document.createElement("div");
  solutionTitle.style.fontWeight = "bold";
  solutionTitle.style.marginTop = "20px";
  solutionTitle.style.marginBottom = "10px";
  solutionTitle.style.fontSize = "18px";
  solutionTitle.textContent = "💡 Solusi:";
  resultCard.appendChild(solutionTitle);

  const solutionText = document.createElement("div");
  solutionText.className = "result-description";
  solutionText.style.backgroundColor = "#ecf0f1";
  solutionText.style.padding = "15px";
  solutionText.style.borderRadius = "8px";
  solutionText.textContent = diagnosaUtama.solusi || "Konsultasikan dengan teknisi.";
  resultCard.appendChild(solutionText);

  // Diagnosa Lainnya yang Cocok
  if (diagnosaLainnya.length > 0) {
    const otherDiagnosisTitle = document.createElement("div");
    otherDiagnosisTitle.style.fontWeight = "bold";
    otherDiagnosisTitle.style.marginTop = "25px";
    otherDiagnosisTitle.style.marginBottom = "15px";
    otherDiagnosisTitle.style.fontSize = "18px";
    otherDiagnosisTitle.style.color = "#e67e22";
    otherDiagnosisTitle.textContent = "🔍 Kerusakan Lain yang Terdeteksi:";
    resultCard.appendChild(otherDiagnosisTitle);

    diagnosaLainnya.forEach((diagnosa, index) => {
      const otherCard = document.createElement("div");
      otherCard.style.backgroundColor = "#fff9f0";
      otherCard.style.border = "2px solid #f39c12";
      otherCard.style.padding = "15px";
      otherCard.style.borderRadius = "8px";
      otherCard.style.marginBottom = "10px";

      const otherName = document.createElement("div");
      otherName.style.fontWeight = "bold";
      otherName.style.fontSize = "18px";
      otherName.style.color = "#d35400";
      otherName.style.marginBottom = "8px";
      otherName.textContent = `${index + 2}. ${diagnosa.nama_kerusakan}`;
      otherCard.appendChild(otherName);

      const otherConfidence = document.createElement("div");
      otherConfidence.style.fontSize = "14px";
      otherConfidence.style.color = "#7f8c8d";
      otherConfidence.style.marginBottom = "8px";
      otherConfidence.textContent = `Keyakinan: ${diagnosa.confidence}% (${diagnosa.jumlahCocok}/${diagnosa.totalGejala} gejala cocok)`;
      otherCard.appendChild(otherConfidence);

      const otherSolution = document.createElement("div");
      otherSolution.style.fontSize = "14px";
      otherSolution.style.color = "#34495e";
      otherSolution.textContent = `Solusi: ${diagnosa.solusi}`;
      otherCard.appendChild(otherSolution);

      resultCard.appendChild(otherCard);
    });

    // Rekomendasi untuk multiple diagnosis
    const recommendationDiv = document.createElement("div");
    recommendationDiv.style.backgroundColor = "#e8f4f8";
    recommendationDiv.style.padding = "15px";
    recommendationDiv.style.borderRadius = "8px";
    recommendationDiv.style.marginTop = "15px";
    recommendationDiv.style.border = "1px solid #3498db";
    
    const recIcon = document.createElement("div");
    recIcon.style.fontWeight = "bold";
    recIcon.style.marginBottom = "8px";
    recIcon.style.color = "#2980b9";
    recIcon.textContent = "💡 Rekomendasi:";
    recommendationDiv.appendChild(recIcon);
    
    const recText = document.createElement("div");
    recText.style.fontSize = "14px";
    recText.style.color = "#34495e";
    recText.textContent = "Karena terdeteksi multiple kerusakan, disarankan untuk memeriksa semua komponen yang terindikasi secara berurutan atau konsultasikan dengan teknisi untuk diagnosa menyeluruh.";
    recommendationDiv.appendChild(recText);
    
    resultCard.appendChild(recommendationDiv);
  }

  const restartButton = document.createElement("button");
  restartButton.className = "btn-restart";
  restartButton.textContent = "🔄 Mulai Diagnosa Baru";
  restartButton.style.marginTop = "20px";
  restartButton.addEventListener("click", restartDiagnosis);
  resultCard.appendChild(restartButton);

  return resultCard;
}

// Tambahkan fungsi ini untuk redirect ke halaman hasil
function redirectToHasil() {
  const hasil = hitungDiagnosa();
  const diagnosaUtama = hasil.diagnosaUtama || hasil;
  const diagnosaLainnya = hasil.diagnosaLainnya || [];
  
  // Simpan ke localStorage
  const hasilData = {
    diagnosaUtama: diagnosaUtama,
    diagnosaLainnya: diagnosaLainnya,
    answers: answers,
    questions: questions,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('hasilDiagnosa', JSON.stringify(hasilData));
  
  // Redirect ke halaman hasil
  window.location.href = './../hasil';
}

// Ubah fungsi showResult menjadi:


function restartDiagnosis() {
  currentQuestion = 0;
  answers = [];
  renderQuestion();
}

// Initialize - tunggu sampai DOM siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ambilSemuaData);
} else {
  ambilSemuaData();
}

// Navbar Toggle for Mobile
const navbarToggle = document.getElementById("navbar-toggle");
const navbarMenu = document.getElementById("navbar-menu");

if (navbarToggle && navbarMenu) {
  navbarToggle.addEventListener("click", () => {
    navbarMenu.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
      navbarMenu.classList.remove("active");
    }
  });

  // Close menu when clicking menu item
  const navbarLinks = document.querySelectorAll(".navbar-link");
  navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbarMenu.classList.remove("active");
    });
  });
}