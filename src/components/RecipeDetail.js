import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeResponse = await axios.get(`http://127.0.0.1:8000/recipes/${id}`);
        console.log('API response:', recipeResponse.data);  // Log the response
        setRecipe(recipeResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the recipe:', error);
        setError(error);
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const recommendationsResponse = await axios.get('http://127.0.0.1:8000/recommendations/', {
          params: { recipe_id: id },
        });
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecipe();
    fetchRecommendations();
  }, [id]);

  if (loading) return <div className="text-center text-gray-500">Loading recipe details...</div>;
  if (error) return <div className="text-center text-red-500">Error loading recipe: {error.message}</div>;
  if (!recipe) return <div className="text-center text-gray-500">No recipe data available.</div>;

  // Parse cooking_directions JSON if it exists
  let cookingDirections = '';
  try {
    if (recipe.cooking_directions) {
      // Replace problematic characters and parse JSON
      const cleanedCookingDirections = recipe.cooking_directions
        .replace(/u"/g, '"')           // Replace unicode literals for double quotes
        .replace(/u'/g, '"')           // Replace unicode literals for single quotes
        .replace(/'/g, '"')            // Replace single quotes with double quotes
        .replace(/\\n/g, '\\\\n');     // Properly escape newline characters

      // Validate JSON structure
      const cookingJson = JSON.parse(cleanedCookingDirections);
      if (cookingJson && cookingJson.directions) {
        cookingDirections = cookingJson.directions.split('\\n').map((line, index) => (
          <p key={index}>{line}</p>
        ));
      } else {
        console.error('Invalid cooking directions JSON format:', cookingJson);
        return <div className="text-center text-red-500">Error: Invalid cooking directions format.</div>;
      }
    }
  } catch (e) {
    console.error('Error parsing cooking directions JSON:', e);
    return <div className="text-center text-red-500">Error parsing cooking directions JSON: {e.message}</div>;
  }

  // Parse ingredients into a list
  const ingredientsList = recipe.ingredients.split('^').map((ingredient, index) => (
    <li key={index}>{ingredient}</li>
  ));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.recipe_name}</h1>
      <img src={recipe.image_url} alt={recipe.recipe_name} className="w-full h-auto mb-4 rounded-lg" />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ingredients:</h2>
        <ul className="list-disc list-inside">{ingredientsList}</ul>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Cooking Directions:</h2>
        <div>{cookingDirections}</div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
        <ul className="list-disc list-inside">
          {recommendations.map((rec) => (
            <li key={rec.recipe_id} className="mb-2">
              <Link to={`/recipes/${rec.recipe_id}`} className="text-blue-500 hover:underline">
                {rec.recipe_name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeDetail;
