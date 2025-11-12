let allStudents = JSON.parse(localStorage.getItem('students_v1')) || [
    {
        id: 1,
        name: "علي حسن",
        studentId: "2024001",
        email: "ali.hassan@example.com",
        year: "1",
        department: "علوم الحاسب"
    },
    {
        id: 2,
        name: "فاطمة السيد",
        studentId: "2024002",
        email: "fatima.s@example.com",
        year: "2",
        department: "هندسة البرمجيات"
    },
    {
        id: 3,
        name: "يوسف إبراهيم",
        studentId: "2023001",
        email: "youssef.i@example.com",
        year: "3",
        department: "نظم المعلومات"
    },
    {
        id: 4,
        name: "نور محمد",
        studentId: "2022005",
        email: "nour.m@example.com",
        year: "2",
        department: "هندسة البرمجيات"
    }
];


const tbody = document.querySelector('#studentsTable tbody');
const searchInput = document.getElementById('searchInput');
const yearFilter = document.getElementById('yearFilter');

const modal = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const f_name = document.getElementById('f_name');
const f_studentId = document.getElementById('f_studentId');
const f_email = document.getElementById('f_email');
const f_year = document.getElementById('f_year');
const f_department = document.getElementById('f_department');

const saveModal = document.getElementById('saveModal');
const closeModal = document.getElementById('closeModal');
const addBtn = document.getElementById('addBtn');

let editingId = null;



function saveToStorage() {
    localStorage.setItem('students_v1', JSON.stringify(allStudents));
}

/**
 * يعرض قائمة الطلاب الممررة له في الجدول
 * @param {Array} studentList - قائمة الطلاب لعرضها
 */
function renderTable(studentList) {
    tbody.innerHTML = '';
    if (studentList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="muted">لا يوجد طلاب يطابقون البحث</td></tr>';
        return;
    }


    studentList.forEach((student, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${student.name}</td>
            <td>${student.studentId}</td>
            <td>${student.email}</td>
            <td>${student.year}</td>
            <td>${student.department}</td>
            <td>
                <button class="small-btn edit" data-id="${student.id}">تعديل</button>
                <button class="small-btn del" data-id="${student.id}">حذف</button>
            </td>
        `;
        tbody.appendChild(tr);
    });


    tbody.querySelectorAll('.small-btn.edit').forEach(btn => btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id); openEdit(id);
    }));
    tbody.querySelectorAll('.small-btn.del').forEach(btn => btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id); confirmDelete(id);
    }));
}


function filterAndRender() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedYear = yearFilter.value;

    let filteredStudents = allStudents;


    if (selectedYear) {
        filteredStudents = filteredStudents.filter(student => student.year === selectedYear);
    }


    if (query) {
        filteredStudents = filteredStudents.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.studentId.toLowerCase().includes(query)
        );
    }


    renderTable(filteredStudents);
}


function openAdd() {
    editingId = null;
    modalTitle.textContent = "إضافة طالب";
    f_name.value = '';
    f_studentId.value = '';
    f_email.value = '';
    f_year.value = '1';
    f_department.value = '';
    modal.style.display = 'flex';
}

function openEdit(id) {
    const student = allStudents.find(x => x.id === id);
    if (!student) return;

    editingId = id;
    modalTitle.textContent = "تعديل بيانات الطالب";
    f_name.value = student.name;
    f_studentId.value = student.studentId;
    f_email.value = student.email;
    f_year.value = student.year;
    f_department.value = student.department;

    modal.style.display = 'flex';
}

function closeModalFn() {
    modal.style.display = 'none';
    editingId = null;
}

function saveModalFn() {
    const name = f_name.value.trim();
    const studentId = f_studentId.value.trim();
    const email = f_email.value.trim();
    const year = f_year.value;
    const department = f_department.value.trim();

    if (!name || !studentId) {
        alert('الرجاء إدخال الاسم والرقم الجامعي على الأقل.');
        return;
    }

    if (editingId) {

        const idx = allStudents.findIndex(x => x.id === editingId);
        if (idx >= 0) {
            allStudents[idx] = { ...allStudents[idx], name, studentId, email, year, department };
        }
    } else {

        const newId = allStudents.length ? Math.max(...allStudents.map(x => x.id)) + 1 : 1;
        allStudents.push({ id: newId, name, studentId, email, year, department });
    }

    saveToStorage();
    filterAndRender();
    closeModalFn();
}

function confirmDelete(id) {
    const student = allStudents.find(x => x.id === id);
    if (!student) return;

    if (confirm(`هل أنت متأكد من حذف الطالب: ${student.name}؟`)) {
        allStudents = allStudents.filter(x => x.id !== id);
        saveToStorage();
        filterAndRender();
    }
}


addBtn.addEventListener('click', openAdd);
closeModal.addEventListener('click', closeModalFn);
saveModal.addEventListener('click', saveModalFn);


searchInput.addEventListener('input', filterAndRender);
yearFilter.addEventListener('change', filterAndRender);


modal.addEventListener('click', function (e) {
    if (e.target === this) closeModalFn();
});


filterAndRender();