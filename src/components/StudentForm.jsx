import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import studentService from "../services/studentService";

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    gpa: "",
    semester: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    enrollmentDate: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingStudents, setExistingStudents] = useState([]);
  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "Civil Engineering",
    "Information Technology",
  ];

  const fetchExistingStudents = async () => {
    try {
      const students = await studentService.getAllStudents();
      setExistingStudents(students);
    } catch (error) {
      console.error("Error fetching existing students:", error);
    }
  };

  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      const student = await studentService.getStudentById(id);
      setFormData({
        ...student,
        dateOfBirth: student.dateOfBirth
          ? student.dateOfBirth.split("T")[0]
          : "",
        enrollmentDate: student.enrollmentDate
          ? student.enrollmentDate.split("T")[0]
          : "",
      });
    } catch (error) {
      toast.error("Error fetching student: " + error.message);
      navigate("/students");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchExistingStudents();
    if (isEditing) {
      fetchStudent();
    }
  }, [isEditing, fetchStudent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Business Constraint 1: Name cannot be empty and must be at least 2 characters
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      // Check for duplicate email
      const duplicateEmail = existingStudents.find(
        (student) =>
          student.email.toLowerCase() === formData.email.toLowerCase() &&
          (!isEditing || student.id.toString() !== id)
      );
      if (duplicateEmail) {
        newErrors.email = "This email is already registered";
      }
    }

    // Roll number validation
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
    } else {
      // Check for duplicate roll number
      const duplicateRoll = existingStudents.find(
        (student) =>
          student.rollNumber.toLowerCase() ===
            formData.rollNumber.toLowerCase() &&
          (!isEditing || student.id.toString() !== id)
      );
      if (duplicateRoll) {
        newErrors.rollNumber = "This roll number is already taken";
      }
    }

    // Business Constraint 2: Department cannot be empty
    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    // Business Constraint 3: GPA must be between 0.0 and 4.0
    const gpa = parseFloat(formData.gpa);
    if (!formData.gpa) {
      newErrors.gpa = "GPA is required";
    } else if (isNaN(gpa) || gpa < 0.0 || gpa > 4.0) {
      newErrors.gpa = "GPA must be between 0.0 and 4.0";
    }

    // Semester validation
    const semester = parseInt(formData.semester);
    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    } else if (isNaN(semester) || semester < 1 || semester > 8) {
      newErrors.semester = "Semester must be between 1 and 8";
    } // Phone validation
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters long";
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 60) {
        newErrors.dateOfBirth = "Age must be between 16 and 60 years";
      }
    }

    // Enrollment date validation
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
    } else {
      const enrollDate = new Date(formData.enrollmentDate);
      const today = new Date();
      if (enrollDate > today) {
        newErrors.enrollmentDate = "Enrollment date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const studentData = {
        ...formData,
        gpa: parseFloat(formData.gpa),
        semester: parseInt(formData.semester),
      };

      if (isEditing) {
        await studentService.updateStudent(id, studentData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.createStudent(studentData);
        toast.success("Student created successfully!");
      }

      navigate("/students");
    } catch (error) {
      toast.error("Error saving student: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading && isEditing) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading student data...</p>
      </div>
    );
  }

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <Card>
          <Card.Header>
            <h4 className="mb-0">
              <i className={`fas fa-${isEditing ? "edit" : "plus"} me-2`}></i>
              {isEditing ? "Edit Student" : "Add New Student"}
            </h4>
          </Card.Header>
          <Card.Body>
            <Alert variant="info" className="mb-4">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Business Rules:</strong>
              <ul className="mb-0 mt-2">
                <li>GPA must be between 0.0 and 4.0</li>
                <li>Department cannot be empty</li>
                <li>Email and Roll Number must be unique</li>
                <li>Age must be between 16 and 60 years</li>
              </ul>
            </Alert>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                      placeholder="Enter full name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                      placeholder="Enter email address"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Roll Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      isInvalid={!!errors.rollNumber}
                      placeholder="Enter roll number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.rollNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department *</Form.Label>
                    <Form.Select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      isInvalid={!!errors.department}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.department}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>GPA * (0.0 - 4.0)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleInputChange}
                      isInvalid={!!errors.gpa}
                      placeholder="Enter GPA"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.gpa}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Semester * (1-8)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="8"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      isInvalid={!!errors.semester}
                      placeholder="Enter semester"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.semester}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      isInvalid={!!errors.phone}
                      placeholder="Enter phone number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      isInvalid={!!errors.dateOfBirth}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dateOfBirth}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Enrollment Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="enrollmentDate"
                      value={formData.enrollmentDate}
                      onChange={handleInputChange}
                      isInvalid={!!errors.enrollmentDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.enrollmentDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      isInvalid={!!errors.address}
                      placeholder="Enter complete address"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-fill"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <i
                        className={`fas fa-${isEditing ? "save" : "plus"} me-1`}
                      ></i>
                      {isEditing ? "Update Student" : "Create Student"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/students")}
                  className="flex-fill"
                >
                  <i className="fas fa-times me-1"></i>
                  Cancel
                </Button>
              </div>
            </Form>{" "}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StudentForm;
