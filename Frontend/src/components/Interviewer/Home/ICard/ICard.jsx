import { useNavigate } from 'react-router';
import './ICard.css';
import CustomeRoutes from '../../../../Routes/CustomRoutes';

function ICard({iid, name, slot, payment, id }) {

    const navigate = useNavigate(CustomeRoutes);
    

    console.log(iid);

    return (
        <>
            <div className="icard" onClick={ () => navigate(`${id}`) } >
                <div className="icard-img-name">
                    <img src="data:image/jpeg;base64,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" alt="Studnet Profile Image" />
                    <h3>{name}</h3>
                </div>
                <div className="icard-line"></div>
                <div className="icard-data">
                    <div className="icard-slot"><span><svg width="15" height="15" viewBox="0 0 122.88 122.88" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g><path fillRule="evenodd" clipRule="evenodd" d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44c0,33.93-27.51,61.44-61.44,61.44C27.51,122.88,0,95.37,0,61.44C0,27.51,27.51,0,61.44,0L61.44,0z M52.92,30.52h7.51c1.37,0,2.5,1.13,2.5,2.5v28.94h26.41c1.38,0,2.5,1.13,2.5,2.5v7.51c0,1.38-1.13,2.5-2.5,2.5H50.41V33.02C50.41,31.64,51.54,30.52,52.92,30.52L52.92,30.52z M61.44,13.95c26.23,0,47.49,21.26,47.49,47.49c0,26.23-21.26,47.49-47.49,47.49c-26.23,0-47.49-21.26-47.49-47.49C13.95,35.22,35.21,13.95,61.44,13.95L61.44,13.95z"/></g></svg></span>
                        <span className='data'>{slot}</span>
                    </div>
                    <p>|</p>
                    <div className="icard-payment"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" fill="currentColor"><path d="M256 59.55c108.49 0 196.45 87.96 196.45 196.45S364.49 452.45 256 452.45 59.55 364.49 59.55 256 147.51 59.55 256 59.55zM256 0c70.68 0 134.69 28.66 181.01 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.69-74.99 181.01C390.69 483.34 326.69 512 256 512s-134.69-28.66-181.02-74.99C28.66 390.69 0 326.68 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm163.27 92.72C377.49 50.94 319.76 25.09 256 25.09c-63.77 0-121.5 25.85-163.28 67.63C50.94 134.5 25.09 192.23 25.09 256c0 63.76 25.85 121.49 67.63 163.27C134.5 461.06 192.23 486.9 256 486.9c63.77 0 121.5-25.84 163.27-67.63 41.79-41.77 67.63-99.5 67.63-163.27 0-63.77-25.84-121.5-67.63-163.28zM181.09 235.97l12.7-28.61h47.9c-3.02-10.16-14.89-15.87-24.84-15.87h-35.76l12.7-28.61h137.12l-12.7 28.61h-33.12c4.39 3.37 9.1 10.32 9.93 15.87h35.89l-12.7 28.61h-25.97c-8.38 21.34-33.95 35.83-55.75 38.97l72.05 74.18h-56.96l-64.25-70.49v-26.27h28.44c2.73 0 5.42-.44 8.06-1.35 6.93-2.34 14.42-7.81 16.74-15.04h-59.48z"/></svg>
                        <span className='data'>{payment}</span>
                    </div>
                </div>
            </div>
            <div>
                <button onClick={()=>navigate(`/call/${iid}`)} >Join Call</button>
            </div>
        </>
        
    );
}

export default ICard;