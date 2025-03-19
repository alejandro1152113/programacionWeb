document.addEventListener("DOMContentLoaded", function () {
    const studentsList = document.getElementById("studentsList");
    const addNewStudentButton = document.getElementById("addNewStudent");
    const studentForm = document.getElementById("studentForm");
    const studentModal = new bootstrap.Modal(document.getElementById("studentModal"));

    // Cargar lista de estudiantes al inicio
    loadStudents();

    // Abrir modal para agregar estudiante
    if (addNewStudentButton) {
        addNewStudentButton.addEventListener("click", function () {
            resetStudentForm(); // Limpiar formulario antes de mostrarlo
            studentModal.show();
        });
    } else {
        console.error("El botón 'Add New Student' no se encontró.");
    }

    // Manejar el envío del formulario para agregar o editar estudiante
    studentForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevenir recarga de la página

        // Recopilar datos del formulario
        const studentData = {
            code: document.getElementById("studentCode").value || null, // Si no tiene código, es un nuevo estudiante
            name: document.getElementById("studentName").value,
            email: document.getElementById("studentEmail").value,
            photo: document.getElementById("studentPhoto").value || "img/default.png",
            github: document.getElementById("studentGithub").value,
        };

        if (studentData.code) {
            // Actualizar estudiante
            api.updateStudent(studentData)
                .then(() => {
                    console.log("Estudiante actualizado:", studentData.code);
                    loadStudents();
                    studentModal.hide(); // Cerrar modal
                })
                .catch(error => {
                    console.error("Error al actualizar estudiante:", error);
                });
        } else {
            // Agregar estudiante nuevo
            api.addStudent(studentData)
                .then(() => {
                    console.log("Estudiante agregado correctamente.");
                    loadStudents();
                    studentModal.hide(); // Cerrar modal
                })
                .catch(error => {
                    console.error("Error al agregar estudiante:", error);
                });
        }
    });

    // Delegar eventos para editar y eliminar estudiantes
    if (studentsList) {
        studentsList.addEventListener("click", function (event) {
            if (event.target.classList.contains("edit-btn")) {
                const studentId = event.target.dataset.id;
                openEditForm(studentId);
            } else if (event.target.classList.contains("delete-btn")) {
                const studentId = event.target.dataset.id;
                deleteStudent(studentId);
            }
        });
    } else {
        console.error("El contenedor 'studentsList' no se encontró.");
    }
});

// Cargar estudiantes desde la API y renderizar en el DOM
async function loadStudents() {
    try {
        const students = await api.getStudents();
        const studentsList = document.getElementById("studentsList");
        studentsList.innerHTML = ""; // Limpiar lista existente

        if (students && students.length > 0) {
            students.forEach(student => {
                const studentCard = document.createElement("div");
                studentCard.className = "card col-md-4";
                studentCard.innerHTML = `
                    <img src="${student.photo || 'img/default.png'}" class="card-img-top" alt="Student Photo">
                    <div class="card-body">
                        <h5 class="card-title">${student.name}</h5>
                        <p class="card-text">Email: ${student.email}</p>
                        <p class="card-text">GitHub: ${student.github}</p>
                        <button class="btn btn-primary edit-btn" data-id="${student.code}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${student.code}">Delete</button>
                    </div>
                `;
                studentsList.appendChild(studentCard);
            });
        } else {
            studentsList.innerHTML = `<p>No students found.</p>`;
        }
    } catch (error) {
        console.error("Error al cargar estudiantes:", error);
    }
}

// Abrir formulario de edición
function openEditForm(studentId) {
    api.getStudentById(studentId)
        .then(student => {
            if (student) {
                // Rellenar el formulario con datos del estudiante
                document.getElementById("studentCode").value = student.code;
                document.getElementById("studentName").value = student.name;
                document.getElementById("studentEmail").value = student.email;
                document.getElementById("studentPhoto").value = student.photo;
                document.getElementById("studentGithub").value = student.github;

                const studentModal = new bootstrap.Modal(document.getElementById("studentModal"));
                studentModal.show();
            } else {
                console.error("Estudiante no encontrado:", studentId);
            }
        })
        .catch(error => {
            console.error("Error al obtener datos del estudiante:", error);
        });
}

// Eliminar estudiante
function deleteStudent(studentId) {
    if (confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
        api.deleteStudent(studentId)
            .then(() => {
                console.log(`Estudiante con ID ${studentId} eliminado.`);
                loadStudents();
            })
            .catch(error => {
                console.error("Error al eliminar estudiante:", error);
            });
    }
}

// Limpiar formulario del modal
function resetStudentForm() {
    document.getElementById("studentCode").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("studentPhoto").value = "";
    document.getElementById("studentGithub").value = "";
}
