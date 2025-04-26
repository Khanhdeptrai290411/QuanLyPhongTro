document.addEventListener('DOMContentLoaded', () => {
    loadPaymentMethods();
    loadRentals();

    // Đặt giới hạn ngày bắt đầu thuê (từ hôm nay trở đi)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('NgayBatDauThue').setAttribute('min', today);

    document.getElementById('rentalForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const TenKhach = document.getElementById('TenKhach').value;
        const SDT = document.getElementById('SDT').value;
        const NgayBatDauThue = document.getElementById('NgayBatDauThue').value;
        const HinhThucThanhToan = document.getElementById('HinhThucThanhToan').value;
        const GhiChu = document.getElementById('GhiChu').value;

        // Kiểm tra TenKhach
        // Regex cho phép chữ cái tiếng Việt (bao gồm cả ký tự có dấu), nhưng không cho phép số và ký tự đặc biệt
        const tenKhachRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ\s]+$/;
        if (!tenKhachRegex.test(TenKhach)) {
            alert('Tên khách hàng không được chứa số hoặc ký tự đặc biệt');
            return;
        }
        if (TenKhach.length <= 5 || TenKhach.length > 50) {
            alert('Tên khách hàng phải có độ dài từ 5 đến 50 ký tự');
            return;
        }

        // Kiểm tra SDT
        const sdtRegex = /^\d{10}$/;
        if (!sdtRegex.test(SDT)) {
            alert('Số điện thoại phải chứa đúng 10 chữ số');
            return;
        }

        // Kiểm tra NgayBatDauThue (đã được xử lý bằng min attribute, nhưng kiểm tra thêm)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(NgayBatDauThue);
        if (inputDate < today) {
            alert('Ngày bắt đầu thuê không được trong quá khứ');
            return;
        }

        const rental = {
            TenKhach,
            SDT,
            NgayBatDauThue,
            HinhThucThanhToan,
            GhiChu
        };

        await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rental)
        }).then(response => response.json())
          .then(data => {
              if (data.error) {
                  alert(data.error);
              } else {
                  loadRentals();
                  document.getElementById('rentalForm').reset();
                  const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
                  modal.hide();
              }
          }).catch(err => {
              alert('Lỗi khi thêm dữ liệu: ' + err.message);
          });
    });

    document.getElementById('searchMaPhongTro').addEventListener('input', searchRentals);
    document.getElementById('searchTenKhach').addEventListener('input', searchRentals);
});

async function loadPaymentMethods() {
    const response = await fetch('/payment-methods');
    const methods = await response.json();
    const select = document.getElementById('HinhThucThanhToan');
    methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method.id;
        option.textContent = method.TenHinhThuc;
        select.appendChild(option);
    });
}

async function loadNextMaPhongTro() {
    const response = await fetch('/next-id');
    const data = await response.json();
    const nextId = data.nextId;
    const nextMaPhongTro = `PT-${String(nextId).padStart(3, '0')}`; // Tạo mã PT-001, PT-002,...
    document.getElementById('MaPhongTro').value = nextMaPhongTro;
}

async function loadRentals() {
    const response = await fetch('/rentals');
    const rentals = await response.json();
    displayRentals(rentals);
}

async function searchRentals() {
    const MaPhongTro = document.getElementById('searchMaPhongTro').value;
    const TenKhach = document.getElementById('searchTenKhach').value;
    const response = await fetch(`/search?MaPhongTro=${MaPhongTro}&TenKhach=${TenKhach}`);
    const rentals = await response.json();
    displayRentals(rentals);
}

function displayRentals(rentals) {
    const tableBody = document.getElementById('rentalTable');
    tableBody.innerHTML = '';
    rentals.forEach((rental, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${rental.MaPhongTro}</td>
            <td>${rental.TenKhach}</td>
            <td>${rental.SDT}</td>
            <td>${rental.NgayBatDauThue}</td>
            <td>${rental.TenHinhThuc}</td>
            <td>${rental.GhiChu || ''}</td>
            <td><input type="checkbox" class="select-row" data-id="${rental.MaPhongTro}"></td>
        `;
        tableBody.appendChild(row);
    });
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll').checked;
    const checkboxes = document.querySelectorAll('.select-row');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll;
    });
}

function deleteSelected() {
    const selected = Array.from(document.querySelectorAll('.select-row:checked'))
        .map(checkbox => checkbox.dataset.id);
    if (selected.length === 0) {
        alert('Vui lòng chọn ít nhất một phòng trọ để xóa.');
        return;
    }

    const confirmMessage = `Bạn có muốn xóa thông tin thuê trọ ${selected.join(', ')} hay không?`;
    document.getElementById('confirmDeleteMessage').textContent = confirmMessage;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

async function confirmDelete() {
    const selected = Array.from(document.querySelectorAll('.select-row:checked'))
        .map(checkbox => checkbox.dataset.id);
    
    for (const MaPhongTro of selected) {
        await fetch(`/delete/${MaPhongTro}`, { method: 'DELETE' });
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    modal.hide();
    loadRentals();
}