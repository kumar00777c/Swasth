// Menu functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const buyMedicineBtn = document.getElementById('buyMedicineBtn');
const consultDoctorBtn = document.getElementById('consultDoctorBtn');
const doctorModal = document.getElementById('doctorModal');
const closeDoctorModal = document.getElementById('closeDoctorModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Open sidebar
menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
});

// Close sidebar
closeBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
}

// Buy Medicine - Redirect to pharmacy website
buyMedicineBtn.addEventListener('click', () => {
    closeSidebar();
    // Redirect to a reliable pharmacy website
    window.open('https://www.netmeds.com', '_blank');
});

// Consult Doctor - Show modal
consultDoctorBtn.addEventListener('click', () => {
    closeSidebar();
    doctorModal.classList.add('active');
});

// Close modal
closeDoctorModal.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);
doctorModal.addEventListener('click', (e) => {
    if (e.target === doctorModal) {
        closeModal();
    }
});

function closeModal() {
    doctorModal.classList.remove('active');
}