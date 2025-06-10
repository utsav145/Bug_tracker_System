import React from 'react';
import '../Styles/AboutUs.css';
import { FaGithub } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Team Information Section */}
      <section className="personal-info">
        <h2 className="team-title">Our Team</h2>
        <div className="team-grid">
          {/* Developer 1 */}
          <div className="profile-section">
            <div className="profile-image">
              <img src="images/utsav.jpg" alt="Your Name" />
            </div>
            <div className="profile-details">
              <h1>Utsav Gavli</h1>
              <p className="role">Full Stack Developer</p>
              <p className="description">
                I am a passionate full-stack developer with expertise in building modern web applications.
                This bug tracking system is one of my projects that demonstrates my skills in both frontend
                and backend development.
              </p>
              <div className="social-links">
                <a href="https://github.com/utsav145" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="github-icon" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Developer 2 */}
          <div className="profile-section">
            <div className="profile-image">
              <img src="images/Shrirag.jpg" alt="Developer 2 Name" />
            </div>
            <div className="profile-details">
              <h1>Shriraj Dhuri</h1>
              <p className="role">Full Stack Developer</p>
              <p className="description">
                A skilled developer with a strong background in web development and database management.
                Contributed to the backend architecture and API development of this bug tracking system.
              </p>
              <div className="social-links">
                <a href="https://github.com/Shriraj48" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="github-icon" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Developer 3 */}
          <div className="profile-section">
            <div className="profile-image">
              <img src="images/Nazmin.jpg" alt="Developer 3 Name" />
            </div>
            <div className="profile-details">
              <h1>Nazmin </h1>
              <p className="role">Full Stack Developer</p>
              <p className="description">
                Experienced in UI/UX design and frontend development. Played a key role in creating
                the user interface and ensuring a smooth user experience in this bug tracking system.
              </p>
              <div className="social-links">
                <a href="https://github.com/Nazmin2224" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="github-icon" />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Information Section */}
      <section className="website-info">
        <h2>About the Bug Tracking System</h2>
        <p className="website-description">
          This bug tracking system is designed to help teams efficiently manage and track software bugs
          throughout the development lifecycle. The system provides different roles with specific
          functionalities to ensure smooth bug management.
        </p>

        <div className="roles-section">
          <h3>System Roles</h3>
          
          <div className="role-card admin">
            <h4>Admin</h4>
            <ul>
              <li>Manage user accounts and permissions</li>
              <li>Create and manage projects</li>
              <li>Assign developers and testers to projects</li>
              <li>Monitor overall system activity</li>
              <li>Generate system-wide reports</li>
            </ul>
          </div>

          <div className="role-card tester">
            <h4>Tester</h4>
            <ul>
              <li>Report new bugs with detailed information</li>
              <li>Track bug status and progress</li>
              <li>Verify bug fixes and updates</li>
              <li>View assigned projects and their bugs</li>
              <li>Communicate with developers about bug details</li>
            </ul>
          </div>

          <div className="role-card developer">
            <h4>Developer</h4>
            <ul>
              <li>View assigned bugs and projects</li>
              <li>Update bug status and progress</li>
              <li>Add comments and updates to bug reports</li>
              <li>Mark bugs as resolved</li>
              <li>Track bug resolution history</li>
            </ul>
          </div>
        </div>

        <div className="features-section">
          <h3>Key Features</h3>
          <ul>
            <li>Real-time bug tracking and updates</li>
            <li>Role-based access control</li>
            <li>Project management capabilities</li>
            <li>Detailed bug reporting system</li>
            <li>User-friendly interface</li>
            <li>Responsive design for all devices</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 