import { Provider } from 'react-redux';
import Routing from './pages/routing';
import store from './store/store';

function App() {
  return (
    <Provider store={store}> 
      <Routing />
    </Provider>
  );
}

export default App;
