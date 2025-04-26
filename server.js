const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Kết nối MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Thay bằng username MySQL của bạn
    password: '', // Thay bằng password MySQL của bạn
    database: 'quanlyphongtro' // Thay bằng tên database của bạn
});

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Kết nối MySQL thành công');
});

// API lấy danh sách phòng trọ
app.get('/rentals', (req, res) => {
    const query = `
        SELECT p.id, p.MaPhongTro, p.TenKhach, p.SDT, p.NgayBatDauThue, h.TenHinhThuc, p.GhiChu
        FROM PhongTro p
        JOIN HinhThucThanhToan h ON p.HinhThucThanhToan = h.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Lỗi lấy dữ liệu' });
        // Định dạng lại ngày thành dd-mm-yyyy
        const formattedResults = results.map(rental => {
            const date = new Date(rental.NgayBatDauThue);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            return {
                ...rental,
                NgayBatDauThue: formattedDate
            };
        });
        res.json(formattedResults);
    });
});

// API thêm phòng trọ
app.post('/add', (req, res) => {
    const { TenKhach, SDT, NgayBatDauThue, HinhThucThanhToan, GhiChu } = req.body;
    const insertQuery = `
        INSERT INTO PhongTro (TenKhach, SDT, NgayBatDauThue, HinhThucThanhToan, GhiChu)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [TenKhach, SDT, NgayBatDauThue, HinhThucThanhToan, GhiChu], (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi thêm dữ liệu' });

        const newId = result.insertId;
        const MaPhongTro = `PT-${String(newId).padStart(3, '0')}`; // Tạo mã PT-001, PT-002,...

        const updateQuery = `
            UPDATE PhongTro SET MaPhongTro = ? WHERE id = ?
        `;
        db.query(updateQuery, [MaPhongTro, newId], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: 'Lỗi cập nhật mã phòng trọ' });
            res.status(200).json({ message: 'Thêm thành công' });
        });
    });
});

// API xóa phòng trọ
app.delete('/delete/:MaPhongTro', (req, res) => {
    const MaPhongTro = req.params.MaPhongTro;
    const query = 'DELETE FROM PhongTro WHERE MaPhongTro = ?';
    db.query(query, [MaPhongTro], (err) => {
        if (err) return res.status(500).json({ error: 'Lỗi xóa dữ liệu' });
        res.status(200).json({ message: 'Xóa thành công' });
    });
});

// API tìm kiếm phòng trọ
app.get('/search', (req, res) => {
    const { MaPhongTro, TenKhach } = req.query;
    let query = `
        SELECT p.id, p.MaPhongTro, p.TenKhach, p.SDT, p.NgayBatDauThue, h.TenHinhThuc, p.GhiChu
        FROM PhongTro p
        JOIN HinhThucThanhToan h ON p.HinhThucThanhToan = h.id
        WHERE 1=1
    `;
    const params = [];
    if (MaPhongTro) {
        query += ' AND p.MaPhongTro LIKE ?';
        params.push(`%${MaPhongTro}%`);
    }
    if (TenKhach) {
        query += ' AND p.TenKhach LIKE ?';
        params.push(`%${TenKhach}%`);
    }
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Lỗi tìm kiếm' });
        res.json(results);
    });
});

// API lấy danh sách hình thức thanh toán
app.get('/payment-methods', (req, res) => {
    const query = 'SELECT * FROM HinhThucThanhToan';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Lỗi lấy danh sách hình thức thanh toán' });
        res.json(results);
    });
});

// API lấy ID lớn nhất để tạo mã phòng trọ tiếp theo
app.get('/next-id', (req, res) => {
    const query = 'SELECT MAX(id) as maxId FROM PhongTro';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi lấy ID lớn nhất' });
        const maxId = result[0].maxId || 0; // Nếu bảng trống, maxId sẽ là 0
        res.json({ nextId: maxId + 1 });
    });
});

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});