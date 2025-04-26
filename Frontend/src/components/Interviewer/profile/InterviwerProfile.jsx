import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import "./style/IntrviwerProfile.css"
import CustomeRoutes from '../../../Routes/CustomRoutes';
import axios from 'axios';
import server from '../../../environment';
const client=axios.create({
    baseURL:`${server}/interviewer`
})

const InterviewerProfile = () => {
    const navigate = useNavigate(CustomeRoutes);
    const { email } = useParams();
    const [student, setStudent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // fetch department data
    const department = "IT";

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await client.get(`/${email}/profile`);

                console.log(response);

                setStudent(response.data.profile);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, [email]);

    // if (loading) return <div className="loading">Loading profile...</div>;
    // if (error) return <div className="error">Error: {error}</div>;
    // if (!student) return <div className="error">No profile data found</div>;

    return (
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

                {/* <div className="student-skills-section">
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
                </div> */}

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

                {/* <div className="student-projects-section">
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
                </div> */}

                {/* {student.resumePDF && (
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
                )} */}

                <div className="student-profile-actions">
                    <button 
                        className='student-profile-back-btn' 
                        onClick={() => navigate(`/student/${email}/home/${department}`)}
                    >
                        Back
                    </button>
                    <button 
                        className='student-profile-edit-btn' 
                        onClick={() => navigate(`/interviewer/${email}/edit-profile`)}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewerProfile;
