import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Table from './components/Table';

function App() {
  return (
    <BrowserRouter>
      <AppRouter/>
      <Table/>
    </BrowserRouter>
  );
}

export default App;
