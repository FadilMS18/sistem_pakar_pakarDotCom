window.addEventListener('DOMContentLoaded', function() {
  const hasilData = localStorage.getItem('hasilDiagnosa');
  
  if (hasilData) {
    const data = JSON.parse(hasilData);
    const diagnosa = data.diagnosaUtama;
    
    console.log('Data Diagnosa:', diagnosa); // Debug
    console.log('Answers:', data.answers); // Debug
    console.log('Questions:', data.questions); // Debug
    
    // Update Sidebar - PENTING!
    updateSidebar(diagnosa, data.answers, data.questions);
    
    // Update Deskripsi
    updateDeskripsi(diagnosa);
    
    // Render Gejala yang BENAR-BENAR dijawab YA
    renderGejalaYangTeridentifikasi(data.answers, data.questions);
    
    // Render Q&A lengkap
    renderQA(data.answers, data.questions);
    
    // Update Solusi
    updateSolusi(diagnosa);
    
    // Render Diagnosa Lainnya jika ada
    if (data.diagnosaLainnya && data.diagnosaLainnya.length > 0) {
      renderDiagnosaLainnya(data.diagnosaLainnya);
    }
  } else {
    console.log('Tidak ada data di localStorage');
    tampilkanPesanKosong();
  }
});

function updateSidebar(diagnosa, answers, questions) {
  console.log('Updating sidebar with:', diagnosa.nama_kerusakan);
  
  // Update result badge berdasarkan kondisi
  const resultBadge = document.querySelector('.result-badge');
  if (resultBadge) {
    if (diagnosa.kd_kerusakan === 'NORMAL') {
      resultBadge.textContent = 'STATUS NORMAL';
      resultBadge.style.background = 'rgba(76, 175, 80, 0.2)';
      resultBadge.style.color = '#81c784';
    } else if (diagnosa.kd_kerusakan === 'INVALID') {
      resultBadge.textContent = 'DATA TIDAK VALID';
      resultBadge.style.background = 'rgba(244, 67, 54, 0.2)';
      resultBadge.style.color = '#ef5350';
    } else {
      resultBadge.textContent = 'HASIL DIAGNOSA';
    }
  }

  // Update icon berdasarkan confidence
  const iconLarge = document.querySelector('.result-icon-large');
  if (iconLarge) {
    if (diagnosa.kd_kerusakan === 'NORMAL') {
      iconLarge.textContent = '✅';
    } else if (diagnosa.kd_kerusakan === 'INVALID') {
      iconLarge.textContent = '❌';
    } else if (diagnosa.confidence >= 70) {
      iconLarge.textContent = '⚠️';
    } else {
      iconLarge.textContent = '🖥️';
    }
  }
  
  // Update title - INI YANG PALING PENTING!
  const titleElement = document.querySelector('.result-title-main');
  if (titleElement) {
    titleElement.textContent = diagnosa.nama_kerusakan || 'Tidak Ada Diagnosa';
    console.log('Title updated to:', diagnosa.nama_kerusakan);
  }
  
  // Update stats
  const statValues = document.querySelectorAll('.stat-value');
  if (statValues.length >= 3) {
    // Total Pertanyaan
    statValues[0].textContent = answers.length.toString();
    
    // Gejala Terdeteksi (hanya yang dijawab YA)
    const gejalaTerdeteksi = answers.filter(a => a.jawaban === 'Ya').length;
    statValues[1].textContent = gejalaTerdeteksi.toString();
    console.log('Gejala terdeteksi:', gejalaTerdeteksi);
    
    // Status
    let statusText = 'Normal';
    if (diagnosa.kd_kerusakan === 'NORMAL') {
      statusText = 'Tidak Ada Kerusakan';
    } else if (diagnosa.kd_kerusakan === 'INVALID') {
      statusText = 'Perlu Diagnosa Ulang';
    } else if (diagnosa.confidence >= 70) {
      statusText = 'Memerlukan Perbaikan';
    } else if (diagnosa.confidence >= 40) {
      statusText = 'Perlu Perhatian';
    } else {
      statusText = 'Pemeriksaan Lebih Lanjut';
    }
    statValues[2].textContent = statusText;
  }
}

function updateDeskripsi(diagnosa) {
  const deskripsiElement = document.querySelector('.description-text');
  if (deskripsiElement) {
    deskripsiElement.textContent = diagnosa.keterangan || 'Tidak ada deskripsi tersedia.';
    console.log('Deskripsi updated');
  }
}

// FUNGSI BARU: Render HANYA gejala yang dijawab YA
function renderGejalaYangTeridentifikasi(answers, questions) {
  const symptomsGrid = document.querySelector('.symptoms-grid');
  if (!symptomsGrid) {
    console.error('symptoms-grid tidak ditemukan!');
    return;
  }
  
  // Hapus semua child elements
  while (symptomsGrid.firstChild) {
    symptomsGrid.removeChild(symptomsGrid.firstChild);
  }
  
  console.log('Rendering gejala yang teridentifikasi...');
  
  // Filter HANYA yang dijawab YA
  const gejalaYa = answers.filter(a => a.jawaban === 'Ya');
  
  console.log('Gejala yang dijawab Ya:', gejalaYa);
  
  if (gejalaYa.length === 0) {
    // Jika tidak ada gejala yang dijawab Ya
    const emptyCard = document.createElement('div');
    emptyCard.style.gridColumn = '1 / -1';
    emptyCard.style.textAlign = 'center';
    emptyCard.style.padding = '30px';
    emptyCard.style.color = '#8b9dc3';
    emptyCard.textContent = 'Tidak ada gejala yang teridentifikasi';
    symptomsGrid.appendChild(emptyCard);
    return;
  }
  
  // Loop hanya untuk gejala yang dijawab Ya
  gejalaYa.forEach((answer) => {
    // Cari index pertanyaan berdasarkan kode_gejala
    const questionIndex = questions.findIndex(q => q.kode_gejala === answer.kode_gejala);
    
    if (questionIndex === -1) {
      console.warn('Pertanyaan tidak ditemukan untuk:', answer.kode_gejala);
      return;
    }
    
    const question = questions[questionIndex];
    
    const symptomCard = document.createElement('div');
    symptomCard.className = 'symptom-card';
    
    const symptomIcon = document.createElement('div');
    symptomIcon.className = 'symptom-icon detected';
    symptomIcon.style.background = 'linear-gradient(135deg, rgba(255, 140, 66, 0.2), rgba(255, 140, 66, 0.1))';
    symptomIcon.style.color = '#ff8c42';
    symptomIcon.textContent = '✓';
    
    const symptomText = document.createElement('div');
    symptomText.className = 'symptom-text';
    
    // Ambil text pertanyaan dan hapus "Apakah " di awal
    let questionText = question.text;
    if (questionText.startsWith('Apakah ')) {
      questionText = questionText.substring(7);
    }
    // Hapus tanda tanya di akhir
    if (questionText.endsWith('?')) {
      questionText = questionText.slice(0, -1);
    }
    
    symptomText.textContent = questionText;
    
    symptomCard.appendChild(symptomIcon);
    symptomCard.appendChild(symptomText);
    symptomsGrid.appendChild(symptomCard);
    
    console.log('Added symptom:', questionText);
  });
}

function renderQA(answers, questions) {
  const qaContainer = document.querySelector('.qa-accordion');
  if (!qaContainer) {
    console.error('qa-accordion tidak ditemukan!');
    return;
  }
  
  // Hapus semua child elements
  while (qaContainer.firstChild) {
    qaContainer.removeChild(qaContainer.firstChild);
  }
  
  console.log('Rendering Q&A...');
  
  answers.forEach((answer, index) => {
    // Cari pertanyaan yang sesuai
    const question = questions.find(q => q.kode_gejala === answer.kode_gejala);
    
    if (!question) {
      console.warn('Pertanyaan tidak ditemukan untuk:', answer.kode_gejala);
      return;
    }
    
    // Item container
    const qaItem = document.createElement('div');
    qaItem.className = 'qa-accordion-item';
    
    // Header
    const qaHeader = document.createElement('div');
    qaHeader.className = 'qa-accordion-header';
    
    // Question wrapper
    const qaQuestionWrapper = document.createElement('div');
    qaQuestionWrapper.className = 'qa-question-wrapper';
    
    // Question number
    const qaQuestionNumber = document.createElement('div');
    qaQuestionNumber.className = 'qa-question-number';
    qaQuestionNumber.textContent = (index + 1).toString();
    
    // Question text
    const qaQuestionText = document.createElement('div');
    qaQuestionText.className = 'qa-question-text';
    qaQuestionText.textContent = question.text;
    
    // Answer label
    const qaAnswerLabel = document.createElement('span');
    qaAnswerLabel.className = 'qa-answer-label';
    
    // Set warna berdasarkan jawaban
    if (answer.jawaban === 'Ya') {
      qaAnswerLabel.style.color = '#ff8c42';
      qaAnswerLabel.style.fontWeight = '600';
    } else {
      qaAnswerLabel.style.color = '#8b9dc3';
    }
    qaAnswerLabel.textContent = `Jawaban: ${answer.jawaban}`;
    
    // Assemble elements
    qaQuestionWrapper.appendChild(qaQuestionNumber);
    qaQuestionWrapper.appendChild(qaQuestionText);
    
    qaHeader.appendChild(qaQuestionWrapper);
    qaHeader.appendChild(qaAnswerLabel);
    
    qaItem.appendChild(qaHeader);
    qaContainer.appendChild(qaItem);
  });
  
  console.log('Q&A rendered:', answers.length, 'items');
}

function updateSolusi(diagnosa) {
  const solusiSection = document.querySelector('.section-solution');
  if (!solusiSection) {
    console.error('section-solution tidak ditemukan!');
    return;
  }
  
  // Hapus konten lama
  while (solusiSection.firstChild) {
    solusiSection.removeChild(solusiSection.firstChild);
  }
  
  // Tambahkan icon warning jika ada
  if (diagnosa.isHighRisk || diagnosa.kd_kerusakan === 'INVALID') {
    const warningIcon = document.createElement('div');
    warningIcon.className = 'warning-icon';
    warningIcon.textContent = '⚠️';
    solusiSection.appendChild(warningIcon);
  }
  
  // Buat wrapper untuk konten
  const contentWrapper = document.createElement('div');
  contentWrapper.style.flex = '1';
  
  // Tambahkan solusi text
  const solusiText = document.createElement('p');
  solusiText.textContent = diagnosa.solusi || 'Konsultasikan dengan teknisi profesional.';
  solusiText.style.color = '#d1dae6';
  solusiText.style.lineHeight = '1.7';
  solusiText.style.margin = '0';
  
  contentWrapper.appendChild(solusiText);
  solusiSection.appendChild(contentWrapper);
  
  console.log('Solusi updated');
}

function renderDiagnosaLainnya(diagnosaLainnya) {
  // Cari section recommendations (yang terakhir)
  const allSections = document.querySelectorAll('.content-section');
  const recommendationsSection = allSections[allSections.length - 1];
  if (!recommendationsSection) return;
  
  // Buat section baru untuk diagnosa lainnya
  const otherDiagnosisWrapper = document.createElement('div');
  otherDiagnosisWrapper.style.marginTop = '30px';
  otherDiagnosisWrapper.style.marginBottom = '20px';
  
  // Title dengan styling sesuai CSS
  const titleWrapper = document.createElement('div');
  titleWrapper.style.display = 'flex';
  titleWrapper.style.alignItems = 'center';
  titleWrapper.style.gap = '15px';
  titleWrapper.style.marginBottom = '20px';
  titleWrapper.style.paddingBottom = '15px';
  titleWrapper.style.borderBottom = '2px solid rgba(255, 140, 66, 0.2)';
  
  const titleIcon = document.createElement('div');
  titleIcon.style.width = '45px';
  titleIcon.style.height = '45px';
  titleIcon.style.background = 'rgba(255, 165, 95, 0.2)';
  titleIcon.style.borderRadius = '12px';
  titleIcon.style.display = 'flex';
  titleIcon.style.alignItems = 'center';
  titleIcon.style.justifyContent = 'center';
  titleIcon.style.fontSize = '1.4em';
  titleIcon.textContent = '🔍';
  
  const title = document.createElement('h3');
  title.style.fontSize = '1.4em';
  title.style.fontWeight = '700';
  title.style.color = '#fff';
  title.textContent = 'Kerusakan Lain yang Terdeteksi';
  
  titleWrapper.appendChild(titleIcon);
  titleWrapper.appendChild(title);
  otherDiagnosisWrapper.appendChild(titleWrapper);
  
  // Warning untuk multiple diagnosis
  const multipleWarning = document.createElement('div');
  multipleWarning.style.background = 'rgba(255, 193, 7, 0.1)';
  multipleWarning.style.border = '1px solid rgba(255, 193, 7, 0.3)';
  multipleWarning.style.padding = '15px 20px';
  multipleWarning.style.borderRadius = '12px';
  multipleWarning.style.marginBottom = '20px';
  multipleWarning.style.color = '#ffc107';
  multipleWarning.style.fontSize = '0.95em';
  multipleWarning.style.display = 'flex';
  multipleWarning.style.alignItems = 'center';
  multipleWarning.style.gap = '10px';
  
  const warningIconSpan = document.createElement('span');
  warningIconSpan.style.fontSize = '1.3em';
  warningIconSpan.textContent = '⚠️';
  
  const warningText = document.createElement('span');
  warningText.textContent = `Terdeteksi ${diagnosaLainnya.length + 1} kemungkinan kerusakan berdasarkan gejala Anda`;
  
  multipleWarning.appendChild(warningIconSpan);
  multipleWarning.appendChild(warningText);
  otherDiagnosisWrapper.appendChild(multipleWarning);
  
  // Loop untuk setiap diagnosa lainnya
  diagnosaLainnya.forEach((diagnosa, index) => {
    const card = document.createElement('div');
    card.style.background = 'rgba(255, 140, 66, 0.05)';
    card.style.border = '1px solid rgba(255, 140, 66, 0.2)';
    card.style.padding = '20px';
    card.style.borderRadius = '12px';
    card.style.marginBottom = '15px';
    card.style.transition = 'all 0.3s ease';
    
    // Hover effect
    card.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(255, 140, 66, 0.08)';
      this.style.borderColor = 'rgba(255, 140, 66, 0.3)';
      this.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.background = 'rgba(255, 140, 66, 0.05)';
      this.style.borderColor = 'rgba(255, 140, 66, 0.2)';
      this.style.transform = 'translateY(0)';
    });
    
    // Nama kerusakan
    const nameWrapper = document.createElement('div');
    nameWrapper.style.display = 'flex';
    nameWrapper.style.alignItems = 'center';
    nameWrapper.style.gap = '10px';
    nameWrapper.style.marginBottom = '12px';
    
    const number = document.createElement('span');
    number.style.fontSize = '1.2em';
    number.style.fontWeight = 'bold';
    number.style.color = '#ff8c42';
    number.textContent = `${index + 2}.`;
    
    const name = document.createElement('span');
    name.style.fontSize = '1.15em';
    name.style.fontWeight = '700';
    name.style.color = '#fff';
    name.textContent = diagnosa.nama_kerusakan;
    
    nameWrapper.appendChild(number);
    nameWrapper.appendChild(name);
    card.appendChild(nameWrapper);
    
    // Confidence
    const confidence = document.createElement('div');
    confidence.style.fontSize = '0.9em';
    confidence.style.color = '#8b9dc3';
    confidence.style.marginBottom = '12px';
    confidence.style.paddingLeft = '30px';
    confidence.textContent = `Tingkat Keyakinan: ${diagnosa.confidence}% (${diagnosa.jumlahCocok}/${diagnosa.totalGejala} gejala cocok)`;
    card.appendChild(confidence);
    
    // Solusi
    const solutionLabel = document.createElement('div');
    solutionLabel.style.fontSize = '0.85em';
    solutionLabel.style.fontWeight = '600';
    solutionLabel.style.color = '#ff8c42';
    solutionLabel.style.marginBottom = '8px';
    solutionLabel.style.paddingLeft = '30px';
    solutionLabel.textContent = '💡 Solusi:';
    card.appendChild(solutionLabel);
    
    const solution = document.createElement('div');
    solution.style.fontSize = '0.95em';
    solution.style.color = '#d1dae6';
    solution.style.lineHeight = '1.6';
    solution.style.paddingLeft = '30px';
    solution.textContent = diagnosa.solusi;
    card.appendChild(solution);
    
    otherDiagnosisWrapper.appendChild(card);
  });
  
  // Tambahkan rekomendasi
  const recommendation = document.createElement('div');
  recommendation.style.background = 'rgba(52, 152, 219, 0.08)';
  recommendation.style.border = '1px solid rgba(52, 152, 219, 0.25)';
  recommendation.style.padding = '20px';
  recommendation.style.borderRadius = '12px';
  recommendation.style.marginTop = '20px';
  
  const recHeader = document.createElement('div');
  recHeader.style.display = 'flex';
  recHeader.style.alignItems = 'center';
  recHeader.style.gap = '10px';
  recHeader.style.marginBottom = '12px';
  
  const recIcon = document.createElement('span');
  recIcon.style.fontSize = '1.3em';
  recIcon.textContent = '💡';
  
  const recTitle = document.createElement('span');
  recTitle.style.fontWeight = '700';
  recTitle.style.color = '#5dade2';
  recTitle.style.fontSize = '1.05em';
  recTitle.textContent = 'Rekomendasi';
  
  recHeader.appendChild(recIcon);
  recHeader.appendChild(recTitle);
  recommendation.appendChild(recHeader);
  
  const recText = document.createElement('div');
  recText.style.fontSize = '0.95em';
  recText.style.color = '#8b9dc3';
  recText.style.lineHeight = '1.7';
  recText.textContent = 'Karena terdeteksi multiple kerusakan, disarankan untuk memeriksa semua komponen yang terindikasi secara berurutan atau konsultasikan dengan teknisi untuk diagnosa menyeluruh.';
  recommendation.appendChild(recText);
  
  otherDiagnosisWrapper.appendChild(recommendation);
  
  // Insert sebelum warning box atau solusi section
  const warningBox = document.querySelector('.warning-box');
  const solusiSection = document.querySelector('.section-solution');
  
  if (solusiSection && solusiSection.parentNode === recommendationsSection) {
    recommendationsSection.insertBefore(otherDiagnosisWrapper, solusiSection);
  } else if (warningBox && warningBox.parentNode === recommendationsSection) {
    recommendationsSection.insertBefore(otherDiagnosisWrapper, warningBox);
  } else {
    recommendationsSection.appendChild(otherDiagnosisWrapper);
  }
}

function tampilkanPesanKosong() {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return;
  
  // Hapus semua konten
  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }
  
  // Buat pesan kosong dengan styling sesuai tema
  const emptySection = document.createElement('div');
  emptySection.className = 'content-section';
  emptySection.style.textAlign = 'center';
  emptySection.style.padding = '80px 40px';
  
  const icon = document.createElement('div');
  icon.style.fontSize = '5em';
  icon.style.marginBottom = '25px';
  icon.style.animation = 'float 3s ease-in-out infinite';
  icon.textContent = '📋';
  
  const title = document.createElement('h2');
  title.style.fontSize = '2em';
  title.style.fontWeight = '800';
  title.style.marginBottom = '15px';
  title.style.color = '#fff';
  title.textContent = 'Tidak Ada Data Diagnosa';
  
  const text = document.createElement('p');
  text.style.fontSize = '1.1em';
  text.style.color = '#8b9dc3';
  text.style.marginBottom = '35px';
  text.style.lineHeight = '1.6';
  text.textContent = 'Silakan lakukan diagnosa terlebih dahulu untuk melihat hasil.';
  
  const button = document.createElement('a');
  button.href = './user-form';
  button.className = 'btn btn-primary';
  button.style.textDecoration = 'none';
  button.style.display = 'inline-flex';
  
  const buttonIcon = document.createElement('span');
  buttonIcon.textContent = '🔬';
  
  const buttonText = document.createElement('span');
  buttonText.textContent = 'Mulai Diagnosa';
  
  button.appendChild(buttonIcon);
  button.appendChild(buttonText);
  
  emptySection.appendChild(icon);
  emptySection.appendChild(title);
  emptySection.appendChild(text);
  emptySection.appendChild(button);
  
  mainContent.appendChild(emptySection);
  
  // Update sidebar juga
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.style.display = 'none';
  }
}

// Update tombol "Diagnosa Baru" untuk clear localStorage
const diagnosaBaru = document.querySelectorAll('a[href*="user-form"]');
diagnosaBaru.forEach(btn => {
  btn.addEventListener('click', function(e) {
    localStorage.removeItem('hasilDiagnosa');
  });
});

// Navbar toggle
const navbarToggle = document.getElementById('navbar-toggle');
const navbarMenu = document.getElementById('navbar-menu');

if (navbarToggle && navbarMenu) {
  navbarToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
      navbarMenu.classList.remove('active');
    }
  });

  const navbarLinks = document.querySelectorAll('.navbar-link');
  navbarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
    });
  });
}
