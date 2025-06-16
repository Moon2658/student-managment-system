import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import studentService from "../services/studentService";

const Home = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGPA: 0,
    departments: [],
    topPerformers: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const students = await studentService.getAllStudents();

      const totalStudents = students.length;
      const averageGPA =
        students.reduce((sum, student) => sum + student.gpa, 0) / totalStudents;

      const departmentCounts = {};
      students.forEach((student) => {
        departmentCounts[student.department] =
          (departmentCounts[student.department] || 0) + 1;
      });

      const topPerformers = students.sort((a, b) => b.gpa - a.gpa).slice(0, 3);

      setStats({
        totalStudents,
        averageGPA: averageGPA.toFixed(2),
        departments: Object.entries(departmentCounts),
        topPerformers,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  return (
    <div className="fade-in">
      <Row className="mb-4">
        <Col>
          <div className="hero-section">
            <h1 className="display-4 mb-3">
              <i className="fas fa-graduation-cap me-3"></i>
              Student Management System
            </h1>
            <p className="lead">
              Manage student records with ease and efficiency
            </p>
            <Button
              as={Link}
              to="/students"
              variant="light"
              size="lg"
              className="me-3"
            >
              <i className="fas fa-users me-2"></i>
              View All Students
            </Button>
            <Button
              as={Link}
              to="/add-student"
              variant="outline-light"
              size="lg"
            >
              <i className="fas fa-plus me-2"></i>
              Add New Student
            </Button>
          </div>
        </Col>
      </Row>{" "}
      <Row>
        <Col md={3} className="mb-4">
          <div className="stats-card bounce-in">
            <i className="fas fa-users text-primary"></i>
            <h6 className="text-primary">Total Students</h6>
            <div className="display-4 fw-bold text-primary">
              {stats.totalStudents}
            </div>
          </div>
        </Col>

        <Col md={3} className="mb-4">
          <div
            className="stats-card bounce-in"
            style={{ animationDelay: "0.1s" }}
          >
            <i className="fas fa-chart-line text-success"></i>
            <h6 className="text-success">Average GPA</h6>
            <div className="display-4 fw-bold text-success">
              {stats.averageGPA}
            </div>
          </div>
        </Col>

        <Col md={3} className="mb-4">
          <div
            className="stats-card bounce-in"
            style={{ animationDelay: "0.2s" }}
          >
            <i className="fas fa-building text-info"></i>
            <h6 className="text-info">Departments</h6>
            <div className="display-4 fw-bold text-info">
              {stats.departments.length}
            </div>
          </div>
        </Col>

        <Col md={3} className="mb-4">
          <div
            className="stats-card bounce-in"
            style={{ animationDelay: "0.3s" }}
          >
            <i className="fas fa-trophy text-warning"></i>
            <h6 className="text-warning">Top Performer</h6>
            <div className="text-center">
              {stats.topPerformers.length > 0 && (
                <>
                  <div className="fw-bold">{stats.topPerformers[0].name}</div>
                  <small className="text-muted">
                    GPA: {stats.topPerformers[0].gpa}
                  </small>
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-building me-2"></i>
                Department Distribution
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.departments.map(([dept, count]) => (
                <div
                  key={dept}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <span>{dept}</span>
                  <span className="badge bg-primary">{count} students</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-trophy me-2"></i>
                Top Performers
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.topPerformers.map((student, index) => (
                <div
                  key={student.id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <div>
                    <span className="me-2">
                      {index === 0 && (
                        <i className="fas fa-crown text-warning"></i>
                      )}
                      {index === 1 && (
                        <i className="fas fa-medal text-secondary"></i>
                      )}
                      {index === 2 && (
                        <i className="fas fa-medal text-warning"></i>
                      )}
                    </span>
                    <Link
                      to={`/student/${student.id}`}
                      className="text-decoration-none"
                    >
                      {student.name}
                    </Link>
                  </div>
                  <span className="badge bg-success">GPA: {student.gpa}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="border-0 bg-light">
            <Card.Body className="text-center">
              <h5>Quick Actions</h5>
              <Button
                as={Link}
                to="/students"
                variant="outline-primary"
                className="me-2 mb-2"
              >
                <i className="fas fa-search me-1"></i>
                Search Students
              </Button>
              <Button
                as={Link}
                to="/add-student"
                variant="outline-success"
                className="me-2 mb-2"
              >
                <i className="fas fa-user-plus me-1"></i>
                Register New Student
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>{" "}
    </div>
  );
};

export default Home;
