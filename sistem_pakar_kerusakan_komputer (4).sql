-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2026 at 02:04 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistem_pakar_kerusakan_komputer`
--

-- --------------------------------------------------------

--
-- Table structure for table `analisa_hasil`
--

CREATE TABLE `analisa_hasil` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `pekerjaan` varchar(100) DEFAULT NULL,
  `merek` varchar(100) DEFAULT NULL,
  `jenis_komputer` varchar(100) DEFAULT NULL,
  `solusi` varchar(255) DEFAULT NULL,
  `id_kerusakan` varchar(10) DEFAULT NULL,
  `id_gejala` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `gejala`
--

CREATE TABLE `gejala` (
  `kd_gejala` varchar(10) NOT NULL,
  `nama_gejala` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gejala`
--

INSERT INTO `gejala` (`kd_gejala`, `nama_gejala`) VALUES
('G1', 'Tidak ada gambar tampil pada monitor'),
('G10', 'Device driver informasi tidak terdeteksi dalam device manager'),
('G11', 'Tiba-tiba OS melakukan restart otomatis'),
('G12', 'Keluarnya blue screen pada OS windows'),
('G13', 'Suara tetap tidak keluar meskipun driver/setting sudah sesuai'),
('G14', 'Muncul pesan error saat menjalankan aplikasi audio'),
('G15', 'Muncul pesan error saat pertama OS di load dari HDD'),
('G16', 'Semua kipas pendingin tidak berputar'),
('G17', 'Sering tiba-tiba mati tanpa sebab'),
('G18', 'Muncul pesan windows kekurangan virtual memory'),
('G19', 'Aplikasi berjalan lambat / respon lambat terhadap inputan'),
('G2', 'Terdapat garis horizontal/vertikal ditengah monitor'),
('G20', 'Kinerja grafis terasa sangat berat (game/manipulasi gambar)'),
('G21', 'Device tidak terdeteksi dalam bios'),
('G22', 'Informasi terdeteksi yang salah dalam bios'),
('G23', 'Hanya sebagian perangkat yang bekerja'),
('G24', 'Sebagian atau seluruh karakter inputan mati'),
('G25', 'Pointer mouse tidak merespon gerakan mouse'),
('G3', 'Tidak ada tampilan awal bios'),
('G4', 'Muncul pesan error pada bios'),
('G5', 'Alarm BIOS berbunyi'),
('G6', 'Terdengar suara aneh pada HDD'),
('G7', 'Sering terjadi hang/crash saat menjalankan aplikasi'),
('G8', 'Selalu scandisk ketika booting'),
('G9', 'Muncul pesan error saat menjalankan game atau aplikasi grafis');

-- --------------------------------------------------------

--
-- Table structure for table `kerusakan`
--

CREATE TABLE `kerusakan` (
  `kd_kerusakan` varchar(10) NOT NULL,
  `nama_kerusakan` varchar(100) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `solusi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kerusakan`
--

INSERT INTO `kerusakan` (`kd_kerusakan`, `nama_kerusakan`, `keterangan`, `solusi`) VALUES
('J1', 'Monitor Rusak', 'Terjadi kerusakan pada layar atau koneksi video', 'Periksa kabel monitor, coba monitor lain, atau ganti monitor jika rusak.'),
('J10', 'Memory Kurang', 'Kapasitas RAM tidak mencukupi kebutuhan aplikasi', 'Tambah kapasitas RAM.'),
('J11', 'Memory VGA Kurang', 'VRAM tidak cukup untuk menjalankan grafis berat', 'Gunakan VGA dengan memori lebih besar.'),
('J12', 'Clock Prosesor Kurang Tinggi', 'Kecepatan prosesor di bawah standar minimum', 'Upgrade prosesor atau sesuaikan konfigurasi sistem.'),
('J13', 'Kabel IDE/SATA/ATA Rusak', 'Konektor data storage mengalami gangguan', 'Ganti atau pasang ulang kabel data.'),
('J14', 'Kurang Daya Pada PSU', 'Daya PSU tidak cukup mengangkat seluruh komponen', 'Gunakan power supply dengan daya lebih besar.'),
('J15', 'Perangkat USB Rusak', 'Port atau controller USB bermasalah', 'Periksa port USB atau ganti perangkat USB.'),
('J16', 'Keyboard Rusak', 'Papan ketik mengalami kegagalan input', 'Ganti keyboard atau periksa koneksi keyboard.'),
('J17', 'Mouse Rusak', 'Perangkat penunjuk tidak berfungsi', 'Ganti mouse atau periksa koneksi mouse.'),
('J2', 'Memori Rusak', 'Modul RAM mengalami kegagalan atau kerusakan fisik', 'Bersihkan RAM, pasang ulang, atau ganti RAM.'),
('J3', 'HDD Rusak', 'Hardisk drive mengalami bad sector atau kerusakan mekanik', 'Backup data jika memungkinkan dan ganti harddisk.'),
('J4', 'VGA Rusak', 'Kartu grafis tidak berfungsi optimal atau rusak', 'Pasang ulang VGA, update driver, atau ganti VGA.'),
('J5', 'Sound Card Rusak', 'Perangkat pemroses audio mengalami gangguan', 'Periksa driver audio atau ganti sound card.'),
('J6', 'OS Bermasalah', 'Sistem operasi mengalami kerusakan file sistem', 'Lakukan repair OS atau instal ulang sistem operasi.'),
('J7', 'Aplikasi Crash/Rusak', 'Software tertentu mengalami konflik atau korup', 'Instal ulang aplikasi atau perbarui aplikasi.'),
('J8', 'Power Supply Rusak', 'PSU tidak memberikan daya yang stabil', 'Periksa atau ganti power supply.'),
('J9', 'Prosesor Rusak', 'Unit pemroses pusat mengalami overheat atau mati', 'Periksa pendingin prosesor atau ganti prosesor.');

-- --------------------------------------------------------

--
-- Table structure for table `pengunjung`
--

CREATE TABLE `pengunjung` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `usia` varchar(50) DEFAULT NULL,
  `jenis_laptop` varchar(100) DEFAULT NULL,
  `alasan_penggunaan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `relasi`
--

CREATE TABLE `relasi` (
  `kd_kerusakan` varchar(10) NOT NULL,
  `kd_gejala` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `relasi`
--

INSERT INTO `relasi` (`kd_kerusakan`, `kd_gejala`) VALUES
('J1', 'G1'),
('J1', 'G2'),
('J10', 'G18'),
('J10', 'G19'),
('J11', 'G20'),
('J11', 'G9'),
('J12', 'G19'),
('J13', 'G21'),
('J14', 'G23'),
('J14', 'G5'),
('J15', 'G10'),
('J16', 'G10'),
('J16', 'G24'),
('J17', 'G10'),
('J17', 'G25'),
('J2', 'G11'),
('J2', 'G12'),
('J2', 'G3'),
('J2', 'G4'),
('J2', 'G5'),
('J3', 'G10'),
('J3', 'G21'),
('J3', 'G22'),
('J3', 'G6'),
('J3', 'G7'),
('J3', 'G8'),
('J4', 'G1'),
('J4', 'G10'),
('J4', 'G12'),
('J4', 'G13'),
('J4', 'G3'),
('J4', 'G5'),
('J4', 'G9'),
('J5', 'G10'),
('J5', 'G13'),
('J5', 'G14'),
('J6', 'G11'),
('J6', 'G12'),
('J6', 'G15'),
('J7', 'G12'),
('J7', 'G7'),
('J8', 'G16'),
('J8', 'G17'),
('J9', 'G1'),
('J9', 'G3'),
('J9', 'G4'),
('J9', 'G5');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analisa_hasil`
--
ALTER TABLE `analisa_hasil`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kd_kerusakan` (`id_kerusakan`,`id_gejala`);

--
-- Indexes for table `gejala`
--
ALTER TABLE `gejala`
  ADD PRIMARY KEY (`kd_gejala`);

--
-- Indexes for table `kerusakan`
--
ALTER TABLE `kerusakan`
  ADD PRIMARY KEY (`kd_kerusakan`);

--
-- Indexes for table `pengunjung`
--
ALTER TABLE `pengunjung`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `relasi`
--
ALTER TABLE `relasi`
  ADD PRIMARY KEY (`kd_kerusakan`,`kd_gejala`),
  ADD KEY `kd_gejala` (`kd_gejala`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analisa_hasil`
--
ALTER TABLE `analisa_hasil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengunjung`
--
ALTER TABLE `pengunjung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `analisa_hasil`
--
ALTER TABLE `analisa_hasil`
  ADD CONSTRAINT `analisa_hasil_ibfk_1` FOREIGN KEY (`id_kerusakan`,`id_gejala`) REFERENCES `relasi` (`kd_kerusakan`, `kd_gejala`);

--
-- Constraints for table `relasi`
--
ALTER TABLE `relasi`
  ADD CONSTRAINT `relasi_ibfk_1` FOREIGN KEY (`kd_kerusakan`) REFERENCES `kerusakan` (`kd_kerusakan`),
  ADD CONSTRAINT `relasi_ibfk_2` FOREIGN KEY (`kd_gejala`) REFERENCES `gejala` (`kd_gejala`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
