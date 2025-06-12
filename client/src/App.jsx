import { Provider } from 'react-redux';
import Routing from './pages/System/routing';
import store from './store/store';

function App() {
  return (
   

    <Provider store={store}> 
     {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@700&family=Roboto:wght@400;900&display=swap" rel="stylesheet" /> */}
     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet" />
     <Routing />
    </Provider>
  );
}

export default App;
