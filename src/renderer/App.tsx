import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { EmotionRecognizer } from './components/MainScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmotionRecognizer />} />
      </Routes>
    </Router>
  );
}
