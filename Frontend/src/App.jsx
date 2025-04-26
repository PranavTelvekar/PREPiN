import './App.css'
import DataState from './Hooks/DataState';
import CustomeRoutes from './Routes/CustomRoutes';
import { useNavigate } from 'react-router-dom';

function App() {

  const navigate = useNavigate(CustomeRoutes);

  return (
      <div className="app-wrapper">
        <DataState.Provider value={ 
          { 
            navigate
          }
         } >
              <CustomeRoutes />
        </DataState.Provider>
      </div>

  )
}

export default App
