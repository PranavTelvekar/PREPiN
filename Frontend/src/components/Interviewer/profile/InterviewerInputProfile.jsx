import { useState } from 'react';
import './InterviewerInputProfile.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import server from '../../../environment';
const client=axios.create({
    baseURL:`${server}/interviewer`
})

function InterviewerInputProfile() {
    const navigate = useNavigate();
    const { email } = useParams();

    // Form state
    const [formData, setFormData] = useState({
        interviewerName: "",
        interviewerBio: "",
        category: "IT",
        totalExperience: "",
        interviewerEducationDegree: "",
        interviewerEducationInstitution: "",
        interviewerEducationYear: "",
        interviewerExperienceTitle: "",
        interviewerExperienceCompanyName: "",
        interviewerExperienceYears: "",
        interviewerExperienceLDate: "",
        interviewerExperienceJDate: "",
        interviewerExperienceDescription: ""
    });
    const [interviewerEducationList, setInterviewerEducationList] = useState([]);
    const [interviewerExperienceList, setInterviewerExperienceList] = useState([]);
    const [photoFile, setPhotoFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        setPhotoFile(e.target.files[0]);
    }

    const handleExperienceClick = () => {
        if (formData.interviewerExperienceTitle.trim() && formData.interviewerExperienceCompanyName.trim()) {
            setInterviewerExperienceList([...interviewerExperienceList, {
                title: formData.interviewerExperienceTitle,
                experience: parseInt(formData.interviewerExperienceYears) || 0,
                company: formData.interviewerExperienceCompanyName,
                startDate: formData.interviewerExperienceJDate,
                endDate: formData.interviewerExperienceLDate,
                description: formData.interviewerExperienceDescription
            }]);
            
            // Reset experience fields
            setFormData(prev => ({
                ...prev,
                interviewerExperienceTitle: "",
                interviewerExperienceYears: "",
                interviewerExperienceCompanyName: "",
                interviewerExperienceJDate: "",
                interviewerExperienceLDate: "",
                interviewerExperienceDescription: ""
            }));
        }
    }

    const removeExperience = (index) => {
        const newExperiences = [...interviewerExperienceList];
        newExperiences.splice(index, 1);
        setInterviewerExperienceList(newExperiences);
    }

    const handleEducationClick = () => {
        if (formData.interviewerEducationDegree.trim() && formData.interviewerEducationInstitution.trim()) {
            setInterviewerEducationList([...interviewerEducationList, {
                degree: formData.interviewerEducationDegree,
                institution: formData.interviewerEducationInstitution,
                yearOfCompletion: formData.interviewerEducationYear
            }]);
            
            // Reset education fields
            setFormData(prev => ({
                ...prev,
                interviewerEducationDegree: "",
                interviewerEducationInstitution: "",
                interviewerEducationYear: ""
            }));
        }
    }

    const removeEducation = (index) => {
        const newEducation = [...interviewerEducationList];
        newEducation.splice(index, 1);
        setInterviewerEducationList(newEducation);
    }

    const calculateTotalExperience = () => {
        if (interviewerExperienceList.length === 0) return 0;
        
        let total = 0;
        interviewerExperienceList.forEach(exp => {
            if (exp.experience) {
                total += parseInt(exp.experience);
            }
        });
        return total;
    };

    const handleSaveClick = async () => {
        if (!formData.interviewerName.trim()) {
            setError("Name is required");
            return;
        }
    
        setIsSubmitting(true);
        setError(null);
    
        try {
            const totalExp = calculateTotalExperience();
            
            const formDataToSend = new FormData();
            
            if (photoFile) formDataToSend.append('photo', photoFile);  // Changed from 'profileImage' to 'photo'
            
            formDataToSend.append('email', email);
            formDataToSend.append('name', formData.interviewerName);
            formDataToSend.append('bio', formData.interviewerBio);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('totalExperience', totalExp.toString());
            
            // Format education data properly
            const formattedEducation = interviewerEducationList.map(edu => ({
                degree: edu.degree,
                institution: edu.institution,
                yearOfCompletion: edu.yearOfCompletion ? new Date(edu.yearOfCompletion).getFullYear() : null
            }));
            formDataToSend.append('education', JSON.stringify(formattedEducation));
            
            // Format experience data properly
            const formattedExperience = interviewerExperienceList.map(exp => ({
                title: exp.title,
                cName: exp.company,
                jDate: exp.startDate,
                lDate: exp.endDate,
                description: exp.description,
                years: exp.experience
            }));
            formDataToSend.append('experience', JSON.stringify(formattedExperience));
    
            const response = await client.post(`/${email}/profile-edit`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.data.success) {
                navigate(`/interviewer/${email}/home`);
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
        <div className="interviewer-input-profile-wrapper">
            <div className='interviewer-input-profile'>
                <h1>Interviewer Profile Setup</h1>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-section">
                    <label htmlFor="interviewer-name">Full Name: *</label>
                    <input 
                        type="text" 
                        id="interviewer-name" 
                        name="interviewerName"
                        value={formData.interviewerName}
                        onChange={handleChange} 
                        required
                    />
                </div>
                
                <div className="form-section">
                    <label htmlFor="interviewer-photo">Upload Profile Photo:</label>
                    <input 
                        type="file" 
                        id="interviewer-photo" 
                        accept="image/*"
                        onChange={handlePhotoChange} 
                    />
                </div>
                
                <div className="form-section">
                    <label htmlFor="interviewer-bio">Professional Bio:</label>
                    <textarea 
                        id="interviewer-bio" 
                        name="interviewerBio"
                        placeholder='Describe your professional background...' 
                        value={formData.interviewerBio}
                        onChange={handleChange} 
                    ></textarea>
                </div>
                
                <div className="form-section">
                    <label htmlFor="category">Professional Category:</label>
                    <select 
                        id="category" 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="IT">IT</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Computer Science">Computer Science</option>
                    </select>
                </div>

                <div className="experience-section">
                    <h2>Professional Experience</h2>
                    <div className="experience-input">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="interviewer-experience-title">Job Title: *</label>
                                <input 
                                    type="text" 
                                    id="interviewer-experience-title" 
                                    name="interviewerExperienceTitle"
                                    value={formData.interviewerExperienceTitle}
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="interviewer-experience-years">Years of Experience: *</label>
                                <input 
                                    type="number" 
                                    id="interviewer-experience-years" 
                                    name="interviewerExperienceYears"
                                    value={formData.interviewerExperienceYears}
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="interviewer-experience-company">Company Name: *</label>
                            <input 
                                type="text" 
                                id="interviewer-experience-company" 
                                name="interviewerExperienceCompanyName"
                                value={formData.interviewerExperienceCompanyName}
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="interviewer-experience-start-date">Start Date:</label>
                                <input 
                                    type="date" 
                                    id="interviewer-experience-start-date" 
                                    name="interviewerExperienceJDate"
                                    value={formData.interviewerExperienceJDate}
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="interviewer-experience-end-date">End Date:</label>
                                <input 
                                    type="date" 
                                    id="interviewer-experience-end-date" 
                                    name="interviewerExperienceLDate"
                                    value={formData.interviewerExperienceLDate}
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="interviewer-experience-description">Role Description:</label>
                            <textarea 
                                id="interviewer-experience-description" 
                                name="interviewerExperienceDescription"
                                placeholder='Describe your responsibilities and achievements...' 
                                value={formData.interviewerExperienceDescription}
                                onChange={handleChange} 
                            ></textarea>
                        </div>
                        
                        <button 
                            className='add-btn' 
                            onClick={handleExperienceClick}
                            disabled={!formData.interviewerExperienceTitle.trim() || 
                                     !formData.interviewerExperienceCompanyName.trim() ||
                                     !formData.interviewerExperienceYears}
                        >
                            Add Experience
                        </button>
                    </div>
                    
                    <div className="experience-list">
                        <h3>Added Experiences</h3>
                        {interviewerExperienceList.length === 0 ? (
                            <p>No experiences added yet</p>
                        ) : (
                            interviewerExperienceList.map((exp, index) => (
                                <div key={index} className="experience-item">
                                    <div className="experience-header">
                                        <h4>{exp.title} at {exp.company}</h4>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeExperience(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <p><strong>Duration:</strong> {exp.startDate} to {exp.endDate || 'Present'}</p>
                                    <p><strong>Years:</strong> {exp.experience} year(s)</p>
                                    {exp.description && <p><strong>Description:</strong> {exp.description}</p>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                <div className="education-section">
                    <h2>Education</h2>
                    <div className="education-input">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="interviewer-education-degree">Degree Earned: *</label>
                                <input 
                                    type="text" 
                                    id="interviewer-education-degree" 
                                    name="interviewerEducationDegree"
                                    value={formData.interviewerEducationDegree}
                                    onChange={handleChange} 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="interviewer-education-institution">Institution: *</label>
                                <input 
                                    type="text" 
                                    id="interviewer-education-institution" 
                                    name="interviewerEducationInstitution"
                                    value={formData.interviewerEducationInstitution}
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="interviewer-education-year">Completion Year:</label>
                            <input 
                                type="date" 
                                id="interviewer-education-year" 
                                name="interviewerEducationYear"
                                value={formData.interviewerEducationYear}
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <button 
                            className='add-btn' 
                            onClick={handleEducationClick}
                            disabled={!formData.interviewerEducationDegree.trim() || 
                                     !formData.interviewerEducationInstitution.trim()}
                        >
                            Add Education
                        </button>
                    </div>
                    
                    <div className="education-list">
                        <h3>Added Education</h3>
                        {interviewerEducationList.length === 0 ? (
                            <p>No education entries added yet</p>
                        ) : (
                            interviewerEducationList.map((edu, index) => (
                                <div key={index} className="education-item">
                                    <div className="education-header">
                                        <h4>{edu.degree}</h4>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeEducation(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <p><strong>Institution:</strong> {edu.institution}</p>
                                    {edu.yearOfCompletion && <p><strong>Completed:</strong> {edu.yearOfCompletion}</p>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                <div className="form-actions">
                    <button 
                        className="save-btn" 
                        onClick={handleSaveClick}
                        disabled={isSubmitting || !formData.interviewerName.trim()}
                    >
                        {isSubmitting ? 'Saving Profile...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterviewerInputProfile;