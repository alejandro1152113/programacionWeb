document.addEventListener('DOMContentLoaded', async () => {
    const studentsList = document.getElementById('studentsList');
    const studentForm = document.getElementById('studentForm');
    const studentModal = new bootstrap.Modal(document.getElementById('studentModal'));

    document.getElementById('loadStudent').addEventListener('click', renderStudents);
    document.getElementById('addNewStudent').addEventListener('click', () => {
        studentForm.reset();
        document.getElementById('studentCode').value = '';
        studentModal.show();
    });

    studentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const studentData = {
            code: document.getElementById('studentCode').value || Math.floor(Math.random() * 1000000).toString(),
            name: document.getElementById('studentName').value,
            email: document.getElementById('studentEmail').value,
            photo: document.getElementById('studentPhoto').value
        };
        
        console.log('Enviando datos del estudiante:', studentData);

        try {
            if (document.getElementById('studentCode').value) {
                console.log('Editando estudiante...');
                await api.updateStudent(studentData);
            } else {
                console.log('Agregando nuevo estudiante...');
                await api.addStudent(studentData);
            }
            
            console.log('Operación exitosa, cerrando modal y recargando lista...');
            studentModal._element.style.display = 'none';
            renderStudents();
        } catch (error) {
            console.error('Error en la operación:', error);
            alert('Ocurrió un error, revisa la consola para más detalles.');
        }
    });

    async function renderStudents() {
        console.log('Cargando estudiantes...');
        const students = await api.getStudents();
        studentsList.innerHTML = '';

        students.forEach(student => {
            const studentCard = document.createElement('div');
            studentCard.className = 'col-md-4 mb-4';
            studentCard.innerHTML = `
                <div class="card">
                    <img src="${student.photo}" class="card-img-top" alt="Student Photo">
                    <div class="card-body">
                        <h5 class="card-title">${student.name}</h5>
                        <p class="card-text">ID: ${student.code}</p>
                        <p class="card-text">${student.email}</p>
                        <button class="btn btn-warning btn-sm editStudent" data-id="${student.code}">Edit</button>
                        <button class="btn btn-danger btn-sm deleteStudent" data-id="${student.code}">Delete</button>
                    </div>
                </div>
            `;
            studentsList.appendChild(studentCard);
        });

        document.querySelectorAll('.editStudent').forEach(button => {
            button.addEventListener('click', async () => {
                console.log('Editando estudiante con ID:', button.dataset.id);
                const student = await api.getStudentById(button.dataset.id);
                document.getElementById('studentCode').value = student.code;
                document.getElementById('studentName').value = student.name;
                document.getElementById('studentEmail').value = student.email;
                document.getElementById('studentPhoto').value = student.photo;
                studentModal.show();
            });
        });

        document.querySelectorAll('.deleteStudent').forEach(button => {
            button.addEventListener('click', async () => {
                console.log('Eliminando estudiante con ID:', button.dataset.id);
                await api.deleteStudent(button.dataset.id);
                renderStudents();
            });
        });
    }

    renderStudents();
});