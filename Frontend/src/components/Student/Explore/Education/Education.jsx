import './Education.css';

function Education({data}) {
    return (
        <div className="education-data">
            <p className='degree' >{data.degree}</p>
            <p><span>Institution: </span>{data.institution}</p>
            <p><span>Year Of Completion: </span>{data.yearOfCompletion}</p>
        </div>
    );
}

export default Education;