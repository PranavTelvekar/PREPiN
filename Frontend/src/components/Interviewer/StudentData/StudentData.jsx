import './StudentData.css';
import Navbar from '../../Navbar/InterviewerNavbar';
import Experience from './Experience/Experience';
import Education from './Education/Education';
import Project from './Project/Project';
import { useNavigate, useParams} from 'react-router';
import CustomeRoutes from '../../../Routes/CustomRoutes';

import axios from 'axios';
import { useEffect ,useState} from 'react';
import server from '../../../environment';
const client=axios.create({
    baseURL:`${server}/interviewer`
})
function StudentData() {

    const navigate = useNavigate(CustomeRoutes);
    const { email ,id} = useParams();
    const [student, setStudent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const handleResumeDownload = () => {
        alert("Resume Downloading...");
    }

    console.log(email);
    console.log(id);

    useEffect(()=>{
        const fetchStudentProfile = async () => {
            try {
                const response = await client.get(`/${email}/${id}/profile`);

                console.log(response);

                setStudent(response.data.profile);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProfile();
    },[email,id])

    return (
        <div className="istudent-data">
            <Navbar />
            <div className="student-profile-display-wrapper">
                <div className="student-profile-display">
                    <h2 className="student-profile-name">Name: {student.name}</h2>
                    
                    <div className="student-profile-photo">
                        <img 
                            src={student.profileImage} 
                            alt="Profile" 
                            // onError={(e) => {
                            //     e.target.src = "https://via.placeholder.com/150";
                            // }}
                        />
                    </div>

                    <p className="student-profile-bio">
                        <span>Bio:</span> {student.Bio || "No bio available"}
                    </p>

                    <div className="student-skills-section">
                        <h3>Skills</h3>
                        <div className="student-skills-list">
                            {student.Skills?.length > 0 ? (
                                student.Skills.map((skill, index) => (
                                    <div key={index} className="student-skills-output">{skill}</div>
                                ))
                            ) : (
                                <p>No skills listed</p>
                            )}
                        </div>
                    </div>

                    <div className="student-education-section">
                        <h3>Education</h3>
                        {student.Education?.length > 0 ? (
                            student.Education.map((edu, index) => (
                                <div key={index} className="student-education-data">
                                    <p className="student-education-para"><span>Degree:</span> {edu.degree}</p>
                                    <p className="student-education-para"><span>Institution:</span> {edu.institution}</p>
                                    <p className="student-education-para"><span>Year of Completion:</span> {edu.yearOfCompletion}</p>
                                </div>
                            ))
                        ) : (
                            <p>No education information available</p>
                        )}
                    </div>

                    <div className="student-experience-section">
                        <h3>Experience</h3>
                        {student.experience?.length > 0 ? (
                            student.experience.map((exp, index) => (
                                <div key={index} className="student-experience-data">
                                    <p className="student-experience-para"><span>Title:</span> {exp.title}</p>
                                    <p className="student-experience-para"><span>Company:</span> {exp.company}</p>
                                    <p className="student-experience-para"><span>Experience:</span> {exp.experience} years</p>
                                    <p className="student-experience-para"><span>Duration:</span> {exp.startDate} - {exp.endDate}</p>
                                    <p className="student-experience-para"><span>Description:</span> {exp.description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No experience information available</p>
                        )}
                    </div>

                    <div className="student-projects-section">
                        <h3>Projects</h3>
                        {student.projects?.length > 0 ? (
                            student.projects.map((project, index) => (
                                <div key={index} className="student-project-data">
                                    <p className="student-project-para"><span>Title:</span> {project.title}</p>
                                    <p className="student-project-para"><span>Description:</span> {project.description}</p>
                                    {project.projectUrl && (
                                        <p className="student-project-para">
                                            <span>Project URL:</span> 
                                            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                                {project.projectUrl}
                                            </a>
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No projects listed</p>
                        )}
                    </div>

                    {student.resumePDF && (
                        <div className="student-profile-resume">
                            <span>Resume:</span> 
                            <a 
                                href={student.resumePDF} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="resume-download-link"
                            >
                                Download Resume
                            </a>
                        </div>
                    )}

                    <div className="student-profile-actions">
                        <button 
                            className='student-profile-back-btn' 
                            onClick={() => navigate(`/interviewer/${email}/home`)}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentData;