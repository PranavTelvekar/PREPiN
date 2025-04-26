import './Experience.css';

function Experience({data}) {
    return (
            <div className="experience-data">
                <p className='title-comapany' >{data.title}</p>
                <p><span>Experience: </span>{data.experience}</p>
                <p><span>Duration: </span>1/1/2020 to 1/1/2022</p>
                <p className='description' ><span>Description: </span>{data.description}</p>
            </div>

    );
}


export default Experience;