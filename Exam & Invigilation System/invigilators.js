let observers = JSON.parse(localStorage.getItem('observers_v1')) || [
  {
    id: 1,
    name: "أحمد محمد",
    code: "MRK001",
    phone: "01012345678",
    email: "ahmed@example.com",
    committees: [
      { room: "قاعة 1", time: "9:00 - 12:00" },
      { room: "قاعة 2", time: "12:30 - 15:00" }
    ]
  },
  {
    id: 2,
    name: "سارة علي",
    code: "MRK002",
    phone: "01098765432",
    email: "sara@example.com",
    committees: [
      { room: "قاعة 3", time: "9:00 - 11:00" },
      { room: "قاعة 4", time: "11:30 - 13:30" }
    ]
  }
];

/* ===== عناصر DOM ===== */
const tbody = document.querySelector('#observersTable tbody');
const detailBox = document.getElementById('detailBox');
const commBox = document.getElementById('commBox');
const commBody = document.getElementById('commBody');
const d_name = document.getElementById('d_name');
const d_phone = document.getElementById('d_phone');
const d_email = document.getElementById('d_email');
const d_count = document.getElementById('d_count');

const modal = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const f_name = document.getElementById('f_name');
const f_code = document.getElementById('f_code');
const f_phone = document.getElementById('f_phone');
const f_email = document.getElementById('f_email');
const f_comm = document.getElementById('f_comm');
const saveModal = document.getElementById('saveModal');
const closeModal = document.getElementById('closeModal');

let editingId = null;

/* ===== دوال العرض ===== */
function saveToStorage(){ localStorage.setItem('observers_v1', JSON.stringify(observers)); }

function renderTable(){
  tbody.innerHTML = '';
  if(observers.length === 0){
    tbody.innerHTML = '<tr><td colspan="7" class="muted">لا يوجد مراقب بعد</td></tr>';
    detailBox.style.display='none'; commBox.style.display='none'; return;
  }
  observers.forEach((o, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${o.name}</td>
      <td>${o.code}</td>
      <td>${o.phone}</td>
      <td>${o.email}</td>
      <td><button class="small-btn show" data-id="${o.id}">عرض</button></td>
      <td>
        <button class="small-btn edit" data-id="${o.id}">تعديل</button>
        <button class="small-btn del" data-id="${o.id}">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  // attach events
  document.querySelectorAll('.small-btn.show').forEach(btn => btn.addEventListener('click', (e)=>{
    const id = parseInt(e.currentTarget.dataset.id); showDetails(id);
  }));
  document.querySelectorAll('.small-btn.edit').forEach(btn => btn.addEventListener('click', (e)=>{
    const id = parseInt(e.currentTarget.dataset.id); openEdit(id);
  }));
  document.querySelectorAll('.small-btn.del').forEach(btn => btn.addEventListener('click', (e)=>{
    const id = parseInt(e.currentTarget.dataset.id); confirmDelete(id);
  }));
}

function showDetails(id){
  const ob = observers.find(x=>x.id===id);
  if(!ob) return;
  d_name.textContent = ob.name;
  d_phone.textContent = ob.phone;
  d_email.textContent = ob.email;
  d_count.textContent = ob.committees.length;
  // committees table
  commBody.innerHTML = '';
  ob.committees.forEach(c=>{
    const row = document.createElement('tr');
    row.innerHTML = `<td>${c.room}</td><td>${c.time}</td>`;
    commBody.appendChild(row);
  });
  detailBox.style.display = 'block';
  commBox.style.display = 'block';
}

/* ===== عمليات الإضافة / التعديل / الحذف ===== */
function openAdd(){
  editingId = null;
  modalTitle.textContent = "إضافة مراقب";
  f_name.value=''; f_code.value=''; f_phone.value=''; f_email.value=''; f_comm.value='';
  modal.style.display='flex';
}
function openEdit(id){
  const ob = observers.find(x=>x.id===id);
  if(!ob) return;
  editingId = id;
  modalTitle.textContent = "تعديل المراقب";
  f_name.value = ob.name; f_code.value = ob.code; f_phone.value = ob.phone; f_email.value = ob.email;
  // join committees as lines "قاعة | وقت"
  f_comm.value = ob.committees.map(c=>`${c.room} | ${c.time}`).join("\n");
  modal.style.display='flex';
}
function closeModalFn(){ modal.style.display='none'; editingId=null; }

function parseCommittees(text){
  const lines = text.split('\n').map(l=>l.trim()).filter(l=>l);
  const arr = [];
  lines.forEach(line=>{
    // format: name | time
    const parts = line.split('|').map(p=>p.trim());
    if(parts.length>=2){
      arr.push({room: parts[0], time: parts[1]});
    } else {
      // if no | provided, skip or use whole as room
      arr.push({room: line, time: ''});
    }
  });
  return arr;
}

function saveModalFn(){
  const name = f_name.value.trim();
  const code = f_code.value.trim();
  const phone = f_phone.value.trim();
  const email = f_email.value.trim();
  const commText = f_comm.value.trim();
  if(!name || !code){
    alert('الرجاء إدخال الاسم والكود على الأقل.');
    return;
  }
  const committees = parseCommittees(commText);
  if(editingId){
    // update
    const idx = observers.findIndex(x=>x.id===editingId);
    if(idx>=0){
      observers[idx].name = name;
      observers[idx].code = code;
      observers[idx].phone = phone;
      observers[idx].email = email;
      observers[idx].committees = committees;
    }
  } else {
    // new
    const newId = observers.length ? Math.max(...observers.map(x=>x.id))+1 : 1;
    observers.push({id:newId,name,code,phone,email,committees});
  }
  saveToStorage();
  renderTable();
  closeModalFn();
}

function confirmDelete(id){
  const ob = observers.find(x=>x.id===id);
  if(!ob) return;
  if(confirm(`هل أنت متأكد من حذف المراقب: ${ob.name}؟`)){
    observers = observers.filter(x=>x.id!==id);
    saveToStorage();
    renderTable();
    detailBox.style.display='none'; commBox.style.display='none';
  }
}

/* bulk actions (example) */
function bulkEdit(){
  alert('ميزة التعديل بالجملة: اختر صفاً واحداً ثم اضغط تعديل — أو أطلب مني تنفيذ متقدم.');
}
function bulkDelete(){
  if(confirm('هل تريد حذف كل المراقبين؟ (اختبار)')){
    observers = [];
    saveToStorage();
    renderTable();
    detailBox.style.display='none'; commBox.style.display='none';
  }
}

/* ===== event listeners ===== */
document.getElementById('addBtn').addEventListener('click', openAdd);
document.getElementById('bulkEditBtn').addEventListener('click', bulkEdit);
document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDelete);
closeModal.addEventListener('click', closeModalFn);
saveModal.addEventListener('click', saveModalFn);

// close modal on backdrop click
document.getElementById('modalBackdrop').addEventListener('click', function(e){
  if(e.target === this) closeModalFn();
});

/* init */
renderTable();