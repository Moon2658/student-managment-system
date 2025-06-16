/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import studentService from "../services/studentService";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudentById(id);
      setStudent(data);
    } catch (error) {
      toast.error("Error fetching student: " + error.message);
      navigate("/students");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await studentService.deleteStudent(id);
      toast.success("Student deleted successfully!");
      navigate("/students");
    } catch (error) {
      toast.error("Error deleting student: " + error.message);
    }
  };

  const getGPABadgeColor = (gpa) => {
    if (gpa >= 3.5) return "success";
    if (gpa >= 3.0) return "warning";
    if (gpa >= 2.5) return "info";
    return "danger";
  };

  const getGPAStatus = (gpa) => {
    if (gpa >= 3.5) return "Excellent";
    if (gpa >= 3.0) return "Good";
    if (gpa >= 2.5) return "Satisfactory";
    return "Needs Improvement";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading student details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
        <h5>Student not found</h5>
        <Button as={Link} to="/students" variant="primary">
          <i className="fas fa-arrow-left me-1"></i>
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 bg-primary text-white">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-user-circle fa-4x"></i>
                    </div>
                    <div>
                      <h2 className="mb-1">{student.name}</h2>
                      <p className="mb-1">
                        <i className="fas fa-id-card me-2"></i>
                        {student.rollNumber}
                      </p>
                      <p className="mb-0">
                        <i className="fas fa-building me-2"></i>
                        {student.department}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="text-center">
                    <Badge
                      bg={getGPABadgeColor(student.gpa)}
                      className="fs-6 p-2"
                    >
                      GPA: {student.gpa.toFixed(2)}
                    </Badge>
                    <div className="mt-1">
                      <small>{getGPAStatus(student.gpa)}</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex gap-2">
            <Button as={Link} to="/students" variant="outline-secondary">
              <i className="fas fa-arrow-left me-1"></i>
              Back to List
            </Button>
            <Button
              as={Link}
              to={`/edit-student/${student.id}`}
              variant="primary"
            >
              <i className="fas fa-edit me-1"></i>
              Edit Student
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <i className="fas fa-trash me-1"></i>
              Delete Student
            </Button>
          </div>
        </Col>
      </Row>

      {/* Student Details */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-user me-2"></i>
                Personal Information
              </h5>
            </Card.Header>
            <Card.Body>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="fw-bold">Full Name:</td>
                    <td>{student.name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Email:</td>
                    <td>
                      <a
                        href={`mailto:${student.email}`}
                        className="text-decoration-none"
                      >
                        {student.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Phone:</td>
                    <td>
                      <a
                        href={`tel:${student.phone}`}
                        className="text-decoration-none"
                      >
                        {student.phone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Date of Birth:</td>
                    <td>
                      {formatDate(student.dateOfBirth)}
                      <small className="text-muted ms-2">
                        ({calculateAge(student.dateOfBirth)} years old)
                      </small>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Address:</td>
                    <td>{student.address}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-graduation-cap me-2"></i>
                Academic Information
              </h5>
            </Card.Header>
            <Card.Body>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="fw-bold">Roll Number:</td>
                    <td>
                      <Badge bg="secondary">{student.rollNumber}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Department:</td>
                    <td>
                      <Badge bg="info">{student.department}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Current Semester:</td>
                    <td>
                      <Badge bg="primary">Semester {student.semester}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">GPA:</td>
                    <td>
                      <Badge
                        bg={getGPABadgeColor(student.gpa)}
                        className="me-2"
                      >
                        {student.gpa.toFixed(2)}
                      </Badge>
                      <small className="text-muted">
                        ({getGPAStatus(student.gpa)})
                      </small>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Enrollment Date:</td>
                    <td>{formatDate(student.enrollmentDate)}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Academic Performance Chart */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Academic Performance Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col md={3}>
                  <div className="border rounded p-3">
                    <i className="fas fa-calendar-alt fa-2x text-primary mb-2"></i>
                    <h6>Current Semester</h6>
                    <h4 className="text-primary">{student.semester}</h4>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="border rounded p-3">
                    <i className="fas fa-chart-line fa-2x text-success mb-2"></i>
                    <h6>Current GPA</h6>
                    <h4 className="text-success">{student.gpa.toFixed(2)}</h4>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="border rounded p-3">
                    <i className="fas fa-percentage fa-2x text-info mb-2"></i>
                    <h6>GPA Percentage</h6>
                    <h4 className="text-info">
                      {((student.gpa / 4.0) * 100).toFixed(1)}%
                    </h4>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="border rounded p-3">
                    <i className="fas fa-medal fa-2x text-warning mb-2"></i>
                    <h6>Performance</h6>
                    <h6 className="text-warning">
                      {getGPAStatus(student.gpa)}
                    </h6>
                  </div>
                </Col>
              </Row>
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
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h5>Are you sure?</h5>
            <p>
              You are about to delete the student record for{" "}
              <strong>{student.name}</strong> ({student.rollNumber}).
            </p>
            <p className="text-danger">
              <small>This action cannot be undone.</small>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            <i className="fas fa-times me-1"></i>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStudent}>
            <i className="fas fa-trash me-1"></i>
            Delete Student
          </Button>{" "}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentDetail;
