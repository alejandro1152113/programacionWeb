document.addEventListener('DOMContentLoaded', async () => {
    const studentsList = document.getElementById('studentsList');
    const studentForm = document.getElementById('studentForm');
    const studentModal = new bootstrap.Modal(document.getElementById('studentModal'));

    document.getElementById('loadStudent').addEventListener('click', renderStudents);
    document.getElementById('addNewStudent').addEventListener('click', () => {
        studentForm.reset();
        studentModal.show();
    });

    studentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const studentData = {
            code: document.getElementById('studentCode').value || null,
            name: document.getElementById('studentName').value,
            email: document.getElementById('studentEmail').value,
            photo: document.getElementById('studentPhoto').value,
            github: document.getElementById('studentGithub').value
        };

        if (studentData.code) {
            await api.updateStudent(studentData);
        } else {
            await api.addStudent(studentData);
        }
        
        studentModal.hide();
        renderStudents();
    });

    async function renderStudents() {
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
                        <a href="https://github.com/${student.github}" class="btn btn-primary">GitHub</a>
                        <button class="btn btn-warning btn-sm editStudent" data-id="${student.code}">Edit</button>
                        <button class="btn btn-danger btn-sm deleteStudent" data-id="${student.code}">Delete</button>
                    </div>
                </div>
            `;
            studentsList.appendChild(studentCard);
        });

        document.querySelectorAll('.editStudent').forEach(button => {
            button.addEventListener('click', async () => {
                const student = await api.getStudentById(button.dataset.id);
                document.getElementById('studentCode').value = student.code;
                document.getElementById('studentName').value = student.name;
                document.getElementById('studentEmail').value = student.email;
                document.getElementById('studentPhoto').value = student.photo;
                document.getElementById('studentGithub').value = student.github;
                studentModal.show();
            });
        });

        document.querySelectorAll('.deleteStudent').forEach(button => {
            button.addEventListener('click', async () => {
                await api.deleteStudent(button.dataset.id);
                renderStudents();
            });
        });
    }
});
