const API_URL = 'https://ubsuofrvgbvtryjuzxhb.supabase.co/rest/v1';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVic3VvZnJ2Z2J2dHJ5anV6eGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2Mjc4MDUsImV4cCI6MjA1NjIwMzgwNX0.-SOdP6tT6URg_Z9x-L9j3R4jw-mSNofm4zIiykmcGYA';

const api = {
    headers: {
        'apikey': API_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    },

    async getStudents() {
        const response = await fetch(`${API_URL}/student?select=*`, { headers: this.headers });
        return response.ok ? response.json() : [];
    },

    async getStudentById(code) {
        const response = await fetch(`${API_URL}/student?code=eq.${code}&select=*`, { headers: this.headers });
        return response.ok ? (await response.json())[0] : null;
    },

    async addStudent(student) {
        if (!student.code) {
            student.code = Date.now().toString(); // Genera un código único
        }
        try {
            const response = await fetch(`${API_URL}/student`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(student)
            });
            return response.ok ? response.json() : Promise.reject(await response.json());
        } catch (error) {
            console.error('Error al agregar estudiante:', error);
        }
    },

    async updateStudent(student) {
        try {
            const response = await fetch(`${API_URL}/student?code=eq.${student.code}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(student)
            });
            return response.ok ? response.json() : Promise.reject(await response.json());
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
        }
    },

    async deleteStudent(code) {
        try {
            const response = await fetch(`${API_URL}/student?code=eq.${code}`, {
                method: 'DELETE',
                headers: this.headers
            });
            return response.ok ? response.json() : Promise.reject(await response.json());
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
        }
    }
};
