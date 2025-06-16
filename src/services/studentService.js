const API_BASE_URL = "http://localhost:3001";

class StudentService {
  async getAllStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  }

  async getStudentById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  }

  async createStudent(student) {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });
      if (!response.ok) {
        throw new Error("Failed to create student");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  }

  async updateStudent(id, student) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });
      if (!response.ok) {
        throw new Error("Failed to update student");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  }

  async deleteStudent(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete student");
      }
      return true;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  }

  // Filter students by department and GPA
  async getFilteredStudents(department = "", minGpa = 0, maxGpa = 4.0) {
    try {
      const students = await this.getAllStudents();
      return students.filter((student) => {
        const deptMatch =
          !department ||
          student.department.toLowerCase().includes(department.toLowerCase());
        const gpaMatch = student.gpa >= minGpa && student.gpa <= maxGpa;
        return deptMatch && gpaMatch;
      });
    } catch (error) {
      console.error("Error filtering students:", error);
      throw error;
    }
  }
}

export default new StudentService();
