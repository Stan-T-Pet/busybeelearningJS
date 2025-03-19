import React, { useState, useEffect } from "react";

function FetchQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Updated endpoint to match your new file name
        const response = await fetch("/api/quizzes/fetchQuiz");
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes.");
        }
        const data = await response.json();
        setQuizzes(data.quizzes || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div key={quiz._id}>
            <h3>{quiz.prompt}</h3>
            <p>Answer: {quiz.answer}</p>
          </div>
        ))
      ) : (
        <p>No quizzes found.</p>
      )}
    </div>
  );
}

export default FetchQuiz;