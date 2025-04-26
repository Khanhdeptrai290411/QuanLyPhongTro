-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 26, 2025 lúc 06:34 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB-log
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quanlyphongtro`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinhthucthanhtoan`
--

CREATE TABLE `hinhthucthanhtoan` (
  `id` int(11) NOT NULL,
  `TenHinhThuc` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hinhthucthanhtoan`
--

INSERT INTO `hinhthucthanhtoan` (`id`, `TenHinhThuc`) VALUES
(1, 'Theo quý'),
(2, 'Theo tháng'),
(3, 'Theo năm');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phongtro`
--

CREATE TABLE `phongtro` (
  `id` int(11) NOT NULL,
  `MaPhongTro` varchar(10) NOT NULL,
  `TenKhach` varchar(100) NOT NULL,
  `SDT` varchar(15) NOT NULL,
  `NgayBatDauThue` date NOT NULL,
  `HinhThucThanhToan` int(11) NOT NULL,
  `GhiChu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phongtro`
--

INSERT INTO `phongtro` (`id`, `MaPhongTro`, `TenKhach`, `SDT`, `NgayBatDauThue`, `HinhThucThanhToan`, `GhiChu`) VALUES
(1, 'PT-001', 'Khánh', '0961001804', '2025-04-26', 2, 'không'),
(2, 'PT-002', 'Lê Quang Phát', '0977887722', '2025-06-23', 2, 'không'),
(3, 'PT-003', 'Lê Quang Khánh', '0988779988', '2026-04-23', 1, 'Phòng hơi dơ'),
(4, 'PT-004', 'Lê Quan Khánh', '0977887722', '2025-12-23', 1, 'Phòng hơi dơ'),
(5, 'PT-005', 'Nguyễn Văn B', '1234567899', '2025-05-23', 2, 'có điều hòa');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `hinhthucthanhtoan`
--
ALTER TABLE `hinhthucthanhtoan`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phongtro`
--
ALTER TABLE `phongtro`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MaPhongTro` (`MaPhongTro`),
  ADD KEY `HinhThucThanhToan` (`HinhThucThanhToan`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `hinhthucthanhtoan`
--
ALTER TABLE `hinhthucthanhtoan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `phongtro`
--
ALTER TABLE `phongtro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `phongtro`
--
ALTER TABLE `phongtro`
  ADD CONSTRAINT `phongtro_ibfk_1` FOREIGN KEY (`HinhThucThanhToan`) REFERENCES `hinhthucthanhtoan` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
