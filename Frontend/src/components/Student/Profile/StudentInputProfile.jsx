import { useState } from 'react';
import './StudentInputProfile.css';
import { useNavigate, useParams } from 'react-router';
import CustomRoutes from '../../../Routes/CustomRoutes';
import axios from 'axios'; // Make sure to install axios: npm install axios
import server from '../../../environment';
const client=axios.create({
    baseURL:`${server}/student`
})

function StudentInputProfile() {
    const navigate = useNavigate(CustomRoutes);
    const { email } = useParams();

    // fetch department of student.
    const department = "IT";

    // Form state
    const [studentName, setStudentName] = useState("");
    const [studentBio, setStudentBio] = useState("");
    const [studentSkill, setStudentSkill] = useState("");
    const [studentSkills, setStudentSkills] = useState([]);
    const [studentEducationDegree, setStudentEducationDegree] = useState("");
    const [studentEducationInstitution, setStudentEducationInstitution] = useState("");
    const [studentEducationYear, setStudentEducationYear] = useState(null);
    const [studentEducationList, setStudentEducationList] = useState([]);
    const [studentExperienceTitle, setStudentExperienceTitle] = useState("");
    const [studentExperienceCompanyName, setStudentExperienceCompanyName] = useState("");
    const [studentExperienceYears, setStudentExperienceYears] = useState("");
    const [studentExperienceLDate, setStudentExperienceLDate] = useState(null);
    const [studentExperienceJDate, setStudentExperienceJDate] = useState(null);
    const [studentExperienceDescription, setStudentExperienceDescription] = useState("");
    const [studentExperienceList, setStudentExperienceList] = useState([]);
    const [studentProjectTitle, setStudentProjectTitle] = useState("");
    const [studentProjectDescription, setStudentProjectDescription] = useState("");
    const [studentProjectLink, setStudentProjectLink] = useState("");
    const [studentProjectList, setStudentProjectList] = useState([]);
    const [photoFile, setPhotoFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handlePhotoChange = (e) => {

        setPhotoFile(e.target.files[0]);
    }

    const handleResumeChange = (e) => {
        setResumeFile(e.target.files[0]);
    }

    const handleSkillsClick = () => {
        if (studentSkill.trim()) {
            setStudentSkills([...studentSkills, studentSkill.trim()]);
            setStudentSkill("");
        }
    }

    const removeSkill = (index) => {
        const newSkills = [...studentSkills];
        newSkills.splice(index, 1);
        setStudentSkills(newSkills);
    }

    const handleProjectClick = () => {
        if (studentProjectTitle.trim() && studentProjectDescription.trim()) {
            setStudentProjectList([...studentProjectList, {
                title: studentProjectTitle,
                description: studentProjectDescription,
                link: studentProjectLink
            }]);
            setStudentProjectTitle("");
            setStudentProjectDescription("");
            setStudentProjectLink("");
        }
    }

    const removeProject = (index) => {
        const newProjects = [...studentProjectList];
        newProjects.splice(index, 1);
        setStudentProjectList(newProjects);
    }

    const handleExperienceClick = () => {
        if (studentExperienceTitle.trim() && studentExperienceCompanyName.trim()) {
            setStudentExperienceList([...studentExperienceList, {
                title: studentExperienceTitle,
                years: studentExperienceYears,
                cName: studentExperienceCompanyName,
                jDate: studentExperienceJDate,
                lDate: studentExperienceLDate,
                description: studentExperienceDescription
            }]);
            setStudentExperienceTitle("");
            setStudentExperienceYears("");
            setStudentExperienceCompanyName("");
            setStudentExperienceJDate(null);
            setStudentExperienceLDate(null);
            setStudentExperienceDescription("");
        }
    }

    const removeExperience = (index) => {
        const newExperiences = [...studentExperienceList];
        newExperiences.splice(index, 1);
        setStudentExperienceList(newExperiences);
    }

    const handleEducationClick = () => {
        if (studentEducationDegree.trim() && studentEducationInstitution.trim()) {
            setStudentEducationList([...studentEducationList, {
                degree: studentEducationDegree,
                institution: studentEducationInstitution,
                yearOfCompletion: studentEducationYear
            }]);
            setStudentEducationDegree("");
            setStudentEducationInstitution("");
            setStudentEducationYear(null);
        }
    }

    const removeEducation = (index) => {
        const newEducation = [...studentEducationList];
        newEducation.splice(index, 1);
        setStudentEducationList(newEducation);
    }

    const handleSaveClick = async () => {
        if (!studentName.trim()) {
            setError("Name is required");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Create FormData for file uploads
            const formData = new FormData();
            
            // Add files if they exist
            if (photoFile) formData.append('photo', photoFile);
            if (resumeFile) formData.append('resume', resumeFile);
            
            // Add all other form data
            formData.append('email', email);
            formData.append('name', studentName);
            formData.append('bio', studentBio);
            formData.append('department', department);
            formData.append('skills', JSON.stringify(studentSkills));
            formData.append('education', JSON.stringify(studentEducationList));
            formData.append('experience', JSON.stringify(studentExperienceList));
            formData.append('projects', JSON.stringify(studentProjectList));

            // Send to backend
            // const response = await axios.post(`/student/${email}/edit-profile`, formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });

            const response=await client.post(`/${email}/profile-edit`,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });



            console.log(response.data.success)

            if (response.data.success) {
                navigate(`/student/${email}/home/${department}`);
            } else {
                setError(response.data.message || "Failed to save profile");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while saving the profile");
            console.error("Error saving profile:", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="student-input-profile-wrapper">
            <div className='student-input-profile'>
                {error && <div className="error-message">{error}</div>}
                
                <label htmlFor="student-name">Enter The Name: </label>
                <input 
                    type="text" 
                    id="student-name" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)} 
                    required
                />
                
                <label htmlFor="student-photo">Upload Photo: </label>
                <input 
                    type="file" 
                    id="student-photo" 
                    accept="image/*"
                    onChange={handlePhotoChange} 
                />
                
                <label htmlFor="student-bio">Bio:</label>
                <textarea 
                    id="student-bio" 
                    placeholder='Tell us about yourself...' 
                    value={studentBio}
                    onChange={(e) => setStudentBio(e.target.value)} 
                ></textarea>
                
                <div className="student-skills">
                    <h2>Skills</h2>
                    <div className="student-skills-input">
                        <label htmlFor="student-skill">Enter Skills: </label>
                        <input 
                            type="text" 
                            id="student-skill" 
                            value={studentSkill}
                            onChange={(e) => setStudentSkill(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && handleSkillsClick()}
                        />
                        <button 
                            className='student-input-profile-btn' 
                            onClick={handleSkillsClick}
                            disabled={!studentSkill.trim()}
                        >
                            ADD
                        </button>
                    </div>
                    <div className="student-skills-output">
                        {studentSkills.map((val, index) => (
                            <div key={index} className="student-skills-output-item">
                                {val}
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeSkill(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="student-projects">
                    <h2>Project Details</h2>
                    <div className="student-project-input">
                        <label htmlFor="student-project-title">Project Title: </label>
                        <input 
                            type="text" 
                            id="student-project-title" 
                            value={studentProjectTitle}
                            onChange={(e) => setStudentProjectTitle(e.target.value)} 
                        />
                        
                        <label htmlFor="student-project-description">Description:</label>
                        <textarea 
                            id="student-project-description" 
                            placeholder='Description...' 
                            value={studentProjectDescription}
                            onChange={(e) => setStudentProjectDescription(e.target.value)} 
                        ></textarea>
                        
                        <label htmlFor="student-project-link">Project Link: </label>
                        <input 
                            type="url" 
                            id="student-project-link" 
                            value={studentProjectLink}
                            onChange={(e) => setStudentProjectLink(e.target.value)} 
                        />
                        
                        <button 
                            className='student-input-profile-btn' 
                            onClick={handleProjectClick}
                            disabled={!studentProjectTitle.trim() || !studentProjectDescription.trim()}
                        >
                            ADD
                        </button>
                    </div>
                    <div className="student-project-output">
                        {studentProjectList.map((val, index) => (
                            <div key={index} className="student-project-data">
                                <p className='student-project-para'><span>Title: </span>{val.title}</p>
                                <p className='student-project-para'><span>Description: </span>{val.description}</p>
                                {val.link && <p className='student-project-para'><span>URL: </span><a href={val.link} target="_blank" rel="noopener noreferrer">{val.link}</a></p>}
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeProject(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="student-experience">
                    <h2>Experience</h2>
                    <div className="student-experience-input">
                        <label htmlFor="student-experience-title">Job Title: </label>
                        <input 
                            type="text" 
                            id="student-experience-title" 
                            value={studentExperienceTitle}
                            onChange={(e) => setStudentExperienceTitle(e.target.value)} 
                        />
                        
                        <label htmlFor="student-experience-years">Years of Experience: </label>
                        <input 
                            type="number" 
                            id="student-experience-years" 
                            value={studentExperienceYears}
                            onChange={(e) => setStudentExperienceYears(e.target.value)} 
                        />
                        
                        <label htmlFor="student-experience-company">Company Name: </label>
                        <input 
                            type="text" 
                            id="student-experience-company" 
                            value={studentExperienceCompanyName}
                            onChange={(e) => setStudentExperienceCompanyName(e.target.value)} 
                        />
                        
                        <div className="date-inputs">
                            <div>
                                <label htmlFor="student-experience-start-date">Join Date: </label>
                                <input 
                                    type="date" 
                                    id="student-experience-start-date" 
                                    value={studentExperienceJDate || ''}
                                    onChange={(e) => setStudentExperienceJDate(e.target.value)} 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="student-experience-leave-date">Leave Date: </label>
                                <input 
                                    type="date" 
                                    id="student-experience-leave-date" 
                                    value={studentExperienceLDate || ''}
                                    onChange={(e) => setStudentExperienceLDate(e.target.value)} 
                                />
                            </div>
                        </div>
                        
                        <label htmlFor="student-experience-description">Description:</label>
                        <textarea 
                            id="student-experience-description" 
                            placeholder='Description...' 
                            value={studentExperienceDescription}
                            onChange={(e) => setStudentExperienceDescription(e.target.value)} 
                        ></textarea>
                        
                        <button 
                            className='student-input-profile-btn' 
                            onClick={handleExperienceClick}
                            disabled={!studentExperienceTitle.trim() || !studentExperienceCompanyName.trim()}
                        >
                            ADD
                        </button>
                    </div>
                    <div className="student-experience-output">
                        {studentExperienceList.map((val, index) => (
                            <div key={index} className="student-experience-data">
                                <p className='student-experience-para'><span>Title: </span>{val.title}</p>
                                <p className='student-experience-para'><span>Experience: </span>{val.years}</p>
                                <p className='student-experience-para'><span>Company Name: </span>{val.cName}</p>
                                <p className='student-experience-para'><span>Duration: </span>{val.jDate} - {val.lDate || 'Present'}</p>
                                <p className='student-experience-para'><span>Description: </span>{val.description}</p>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeExperience(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="student-education">
                    <h2>Education</h2>
                    <div className="student-education-input">
                        <label htmlFor="student-education-degree">Degree: </label>
                        <input 
                            type="text" 
                            id="student-education-degree" 
                            value={studentEducationDegree}
                            onChange={(e) => setStudentEducationDegree(e.target.value)} 
                        />
                        
                        <label htmlFor="student-education-institution">Institution: </label>
                        <input 
                            type="text" 
                            id="student-education-institution" 
                            value={studentEducationInstitution}
                            onChange={(e) => setStudentEducationInstitution(e.target.value)} 
                        />
                        
                        <label htmlFor="student-education-year-of-completion">Year of Completion: </label>
                        <input 
                            type="date" 
                            id="student-education-year-of-completion" 
                            value={studentEducationYear || ''}
                            onChange={(e) => setStudentEducationYear(e.target.value)} 
                        />
                        
                        <button 
                            className='student-input-profile-btn' 
                            onClick={handleEducationClick}
                            disabled={!studentEducationDegree.trim() || !studentEducationInstitution.trim()}
                        >
                            ADD
                        </button>
                    </div>
                    <div className="student-education-output">
                        {studentEducationList.map((val, index) => (
                            <div key={index} className="student-education-data">
                                <p className='student-education-para'><span>Degree: </span>{val.degree}</p>
                                <p className='student-education-para'><span>Institution: </span>{val.institution}</p>
                                <p className='student-education-para'><span>Year Of Completion: </span>{val.yearOfCompletion}</p>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeEducation(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <label htmlFor="student-resume-upload">Upload Resume: </label>
                <input 
                    type="file" 
                    id="student-resume-upload" 
                    accept="image/*"
                    onChange={handleResumeChange} 
                />
                
                <button 
                    className="student-input-profile-save-btn" 
                    onClick={handleSaveClick}
                    disabled={isSubmitting || !studentName.trim()}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
}

export default StudentInputProfile;