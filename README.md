# sistem_pakar_pakarDotCom

live version
http://fadilms18.github.io/sistem_pakar_pakarDotCom


jalankan sql untuk melihat table rapi
SELECT id_kerusakan, GROUP_CONCAT(id_gejala SEPARATOR ', ') AS daftar_gejala
FROM relasi
GROUP BY id_kerusakan;