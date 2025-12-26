const form = document.getElementById("formPengunjung");

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // mencegah reload

  const formData = {
    nama: form.nama.value,
    usia: form.usia.value,
    jenis_laptop: form.jenis_laptop.value,
    alasan_penggunaan: form.alasan_penggunaan.value,
  };

  try {
    const respon = await fetch("http://localhost:3000/api/pengunjung", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result = await respon.json();

    if (respon.ok) {
      window.location.href = "/page-pertanyaan/index.html";
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert("Terjadi Kesalahan koneksi");
  }
});
