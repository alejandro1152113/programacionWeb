const API_URL = 'https://ubsuofrvgbvtryjuzxhb.supabase.co/rest/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVic3VvZnJ2Z2J2dHJ5anV6eGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Mjc4MDUsImV4cCI6MjA1NjIwMzgwNX0.-SOdP6tT6URg_Z9x-L9j3R4jw-mSNofm4zIiykmcGYA';

const api = {
    headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    },

    // Obtener todos los estudiantes
    async getStudents() {
        try {
            const response = await fetch(`${API_URL}/student?select=*`, { headers: this.headers });
            if (!response.ok) {
                throw new Error(`Error al obtener estudiantes: ${response.status} - ${response.statusText}`);
            }
            const students = await response.json();
            console.log("Estudiantes obtenidos:", students);
            return students;
        } catch (error) {
            console.error("Error en getStudents:", error.message);
            return [];
        }
    },

    // Obtener un estudiante por su código
    async getStudentById(code) {
        try {
            const response = await fetch(`${API_URL}/student?code=eq.${code}&select=*`, { headers: this.headers });
            if (!response.ok) {
                throw new Error(`Error al obtener estudiante con código ${code}: ${response.status} - ${response.statusText}`);
            }
            const student = (await response.json())[0];
            console.log("Estudiante obtenido:", student);
            return student || null; // Si no hay resultados, devuelve null
        } catch (error) {
            console.error("Error en getStudentById:", error.message);
            return null;
        }
    },

    // Agregar un nuevo estudiante
    async addStudent(student) {
        if (!student.code) {
            // Generar un código único alfanumérico de longitud 7
            student.code = Math.random().toString(36).substring(2, 9);
        }
        try {
            // Excluir campos no necesarios como 'github'
            const { github, ...studentData } = student;

            const response = await fetch(`${API_URL}/student`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Error al agregar estudiante: ${JSON.stringify(errorDetails)}`);
            }

            const result = await response.json();
            console.log("Estudiante agregado:", result);
            return result;
        } catch (error) {
            console.error("Error en addStudent:", error.message);
            throw error;
        }
    },

    // Actualizar un estudiante existente
    async updateStudent(student) {
        try {
            // Excluir campos no necesarios como 'github'
            const { github, ...studentData } = student;

            const response = await fetch(`${API_URL}/student?code=eq.${student.code}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Error al actualizar estudiante con código ${student.code}: ${JSON.stringify(errorDetails)}`);
            }

            const result = await response.json();
            console.log("Estudiante actualizado:", result);
            return result;
        } catch (error) {
            console.error("Error en updateStudent:", error.message);
            throw error;
        }
    },

    // Eliminar un estudiante por su código
    async deleteStudent(code) {
        try {
            const response = await fetch(`${API_URL}/student?code=eq.${code}`, {
                method: 'DELETE',
                headers: this.headers,
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Error al eliminar estudiante con código ${code}: ${JSON.stringify(errorDetails)}`);
            }

            console.log(`Estudiante con código ${code} eliminado.`);
            return true; // Devuelve true si la eliminación fue exitosa
        } catch (error) {
            console.error("Error en deleteStudent:", error.message);
            throw error;
        }
    },
};
