// src/HomePage.tsx

import { useNavigate } from 'react-router-dom';
// import logo from './assets/logo.png'; // Assuming you have a logo in the assets folder

function HomePage() {
  const navigate = useNavigate();

  const handleBeginClick = () => {
    navigate("/instructions");
  };

  return (
    <div className="homepage">
      <header>
        <h2>Welcome to AI-powered Rock Paper Scissors!</h2>
      </header>
      <p>Test your luck against the other team. Are you ready?</p>
      <button onClick={handleBeginClick}>Let's Play!</button>
    </div>
  );
}

export default HomePage;
