# sistem_pakar_pakarDotCom

live version
http://fadilms18.github.io/sistem_pakar_pakarDotCom


jalankan sql untuk melihat table rapi
SELECT kd_kerusakan, GROUP_CONCAT(kd_gejala SEPARATOR ', ') AS daftar_gejala
FROM relasi
GROUP BY kd_kerusakan;