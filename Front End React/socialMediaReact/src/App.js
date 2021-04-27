
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Admin from './Components/Admin/Admin'
import Footer from './Components/User/Footer'
import User from './Components/User/User'


function App() {
  return (
    <div className="App">
      <Router>
        <Route path='/'><User /><Footer /></Route>
        <Route path="/admin"><Admin /></Route>
      </Router>
    </div>
  );
}

export default App;
