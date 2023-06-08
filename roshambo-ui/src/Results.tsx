import { useEffect, useState } from 'react'

function Results() {
  const [results, setResults] = useState<{rock: number, paper: number, scissors: number}>({rock: 0, paper: 0, scissors: 0})

  useEffect(() => {
    setResults({rock: 10, paper: 20, scissors: 30}); // placeholder values
  }, [])

  return (
    <div>
      <h1>Results</h1>
      <p>Rock: {results.rock}</p>
      <p>Paper: {results.paper}</p>
      <p>Scissors: {results.scissors}</p>
    </div>
  )
}

export default Results;
