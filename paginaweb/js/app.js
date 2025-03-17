// Modificaciones en app.js para confirmar acciones y ajustar la UI de edición

document.addEventListener("DOMContentLoaded", function () {
    const studentList = document.getElementById("student-list");

    studentList.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-btn")) {
            const studentId = event.target.dataset.id;
            if (confirm("¿Estás seguro de que quieres editar este estudiante?")) {
                openEditForm(studentId);
            }
        } else if (event.target.classList.contains("delete-btn")) {
            const studentId = event.target.dataset.id;
            if (confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
                deleteStudent(studentId);
            }
        }
    });
});

function openEditForm(studentId) {
    const editContainer = document.getElementById("edit-container");
    const editForm = document.getElementById("edit-form");
    const studentCard = document.getElementById("student-card");
    
    // Mostrar la UI con el diseño de imagen a la derecha y datos a la izquierda
    editContainer.style.display = "flex";
    editForm.style.flex = "1";
    studentCard.style.flex = "1";
    studentCard.style.textAlign = "center";
    
    // Cargar los datos del estudiante
    loadStudentData(studentId);
}

function deleteStudent(studentId) {
    // Lógica para eliminar el estudiante de la base de datos
    console.log("Eliminando estudiante con ID:", studentId);
}