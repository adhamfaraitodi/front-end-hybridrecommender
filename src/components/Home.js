import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/random/');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching random recipes:', error);
      }
    };

    fetchRandomRecipes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Recommendation Recipes</h1>
      <ul className="list-disc list-inside">
        {recipes.map((recipe) => (
          <li key={recipe.recipe_id} className="mb-2">
            <Link to={`/recipes/${recipe.recipe_id}`} className="text-blue-500 hover:underline">
              {recipe.recipe_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
