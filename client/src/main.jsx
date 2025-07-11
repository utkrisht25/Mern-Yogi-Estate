import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider  } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';


import './index.css'
import App from './App.jsx'
import { store , persistor} from './redux/store.js';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <PersistGate loading= {null} persistor={persistor}>
       <App />
      </PersistGate>
    </Provider>,
)
