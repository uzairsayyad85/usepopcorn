/* eslint-disable react/prop-types */
export default function MovieList({ moviesData, handleSelectedId }) {
  return (
    <ul className="list list-movies">
      {moviesData?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          handleSelectedId={handleSelectedId}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectedId }) {
  return (
    <li onClick={() => handleSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </div>
    </li>
  );
}
