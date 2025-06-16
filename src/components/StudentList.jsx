import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import studentService from "../services/studentService";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [gpaFilter, setGpaFilter] = useState({ min: 0, max: 4.0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [departments, setDepartments] = useState([]);

  const applyFilters = useCallback(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(
        (student) => student.department === departmentFilter
      );
    }

    // GPA filter
    filtered = filtered.filter(
      (student) => student.gpa >= gpaFilter.min && student.gpa <= gpaFilter.max
    );

    setFilteredStudents(filtered);
  }, [students, searchTerm, departmentFilter, gpaFilter]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents();
      setStudents(data);

      // Extract unique departments
      const uniqueDepartments = [
        ...new Set(data.map((student) => student.department)),
      ];
      setDepartments(uniqueDepartments);
    } catch (error) {
      toast.error("Error fetching students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await studentService.deleteStudent(studentToDelete.id);
      setStudents(
        students.filter((student) => student.id !== studentToDelete.id)
      );
      toast.success("Student deleted successfully!");
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error("Error deleting student: " + error.message);
    }
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setGpaFilter({ min: 0, max: 4.0 });
  };

  const getGPABadgeColor = (gpa) => {
    if (gpa >= 3.5) return "success";
    if (gpa >= 3.0) return "warning";
    if (gpa >= 2.5) return "info";
    return "danger";
  };
  if (loading) {
    return (
      <div className="text-center py-5 fade-in">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0">
                    <i className="fas fa-users me-2"></i>
                    Student Management
                  </h4>
                </Col>
                <Col xs="auto">
                  <Button as={Link} to="/add-student" variant="primary">
                    <i className="fas fa-plus me-1"></i>
                    Add Student
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {/* Filters */}
              <Row className="mb-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, roll number, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    placeholder="Min GPA"
                    min="0"
                    max="4"
                    step="0.1"
                    value={gpaFilter.min}
                    onChange={(e) =>
                      setGpaFilter({
                        ...gpaFilter,
                        min: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    placeholder="Max GPA"
                    min="0"
                    max="4"
                    step="0.1"
                    value={gpaFilter.max}
                    onChange={(e) =>
                      setGpaFilter({
                        ...gpaFilter,
                        max: parseFloat(e.target.value) || 4.0,
                      })
                    }
                  />
                </Col>
                <Col md={1}>
                  <Button variant="outline-secondary" onClick={resetFilters}>
                    <i className="fas fa-times"></i>
                  </Button>
                </Col>
              </Row>

              {/* Results Summary */}
              <Alert variant="info" className="mb-3">
                <i className="fas fa-info-circle me-2"></i>
                Showing {filteredStudents.length} of {students.length} students
                {(searchTerm ||
                  departmentFilter ||
                  gpaFilter.min > 0 ||
                  gpaFilter.max < 4.0) && <span> (filtered)</span>}
              </Alert>

              {/* Students Table */}
              {filteredStudents.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                  <h5>No students found</h5>
                  <p className="text-muted">
                    Try adjusting your search criteria or add a new student.
                  </p>
                  <Button as={Link} to="/add-student" variant="primary">
                    <i className="fas fa-plus me-1"></i>
                    Add First Student
                  </Button>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Roll Number</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>GPA</th>
                      <th>Semester</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <strong>{student.rollNumber}</strong>
                        </td>
                        <td>{student.name}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {student.department}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${getGPABadgeColor(
                              student.gpa
                            )}`}
                          >
                            {student.gpa.toFixed(2)}
                          </span>
                        </td>
                        <td>{student.semester}</td>
                        <td>
                          <small>{student.email}</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Button
                              as={Link}
                              to={`/student/${student.id}`}
                              variant="outline-info"
                              size="sm"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              as={Link}
                              to={`/edit-student/${student.id}`}
                              variant="outline-primary"
                              size="sm"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => confirmDelete(student)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {studentToDelete && (
            <p>
              Are you sure you want to delete student{" "}
              <strong>{studentToDelete.name}</strong> (
              {studentToDelete.rollNumber})? This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStudent}>
            <i className="fas fa-trash me-1"></i>
            Delete Student
          </Button>{" "}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentList;
