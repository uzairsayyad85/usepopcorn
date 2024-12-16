import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Search from "./components/navbar/Search";
import NumResults from "./components/navbar/NumResults";
import Mainn from "./Mainn";
import Box from "./components/main/Box";
import Loader from "./components/main/box1/Loader";
import MovieList from "./components/main/box1/MovieList";
import ErrorMessage from "./components/main/box1/ErrorMessage";
import MovieDetails from "./components/main/box2/MovieDetails";
import WatchedSummary from "./components/main/box2/WatchedSummary";
import WatchedMoviesList from "./components/main/box2/WatchedMoviesList";

const KEY = "d0245e5f";

export default function App() {
  const [query, setQuery] = useState("Inception");
  const [isLoading, setIsLoading] = useState(false);
  const [moviesData, setMoviesData] = useState([]);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useState(function () {
    const storeValue = localStorage.getItem("watched");
    return storeValue ? JSON.parse(storeValue) : [];
  });


  function handleAddWatched(movie) {
    setWatched((watched) => (watched ? [...watched, movie] : [movie]));
  }

  function handleSelectedId(imdbID) {
    setSelectedId((selectedId) => (selectedId === imdbID ? null : imdbID));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMoviesData(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMoviesData([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults moviesData={moviesData} />
      </NavBar>
      <Mainn>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              moviesData={moviesData}
              handleSelectedId={handleSelectedId}
            />
          )}
          {error && <ErrorMessage error={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handleCloseMovie={handleCloseMovie}
              handleAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Mainn>
    </>
  );
}
