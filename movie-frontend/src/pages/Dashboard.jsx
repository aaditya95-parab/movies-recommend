import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [user, setUser] = useState(null);

  const MOVIES_PER_PAGE = 8;

  // ── Load User ──
  useEffect(() => {

    try {

      console.log("🔍 Dashboard: Checking localStorage for user...");
      const storedUser =
        JSON.parse(localStorage.getItem("user"));

      console.log("📦 Dashboard: Retrieved user:", storedUser);

      if (!storedUser) {

        console.warn("⚠️ Dashboard: No user found in localStorage. Redirecting to login...");
        navigate("/");

      } else {

        console.log("✅ Dashboard: User authenticated. Loading movies...");
        setUser(storedUser);
      }

    } catch (error) {

      console.error("❌ Dashboard: Error parsing user from localStorage:", error);
      localStorage.removeItem("user");

      navigate("/");
    }

  }, [navigate]);

  // ── Logout ──
  const logout = () => {

    localStorage.removeItem("user");

    navigate("/");
  };

  // ── Fetch Movies ──
  useEffect(() => {

    setLoading(true);

    setError("");

    axios
      .get("http://localhost:8080/movies/trending")

      .then((response) => {

        setMovies(response.data.results);

        setFilteredMovies(response.data.results);

        setLoading(false);
      })

      .catch(() => {

        setError(
          "Failed to fetch movies. Please check backend server."
        );

        setLoading(false);
      });

  }, []);

  // ── Search + Filter ──
  useEffect(() => {

    let updatedMovies = [...movies];

    // Search
    if (search) {

      updatedMovies = updatedMovies.filter((movie) =>
        movie.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }


    // Filter
    if (selectedFilter !== "All") {

      updatedMovies = updatedMovies.filter((movie) => {

        if (selectedFilter === "Top Rated") {
          return movie.vote_average >= 7;
        }

        if (selectedFilter === "Popular") {
          return movie.popularity >= 50;
        }

        return true;
      });
    }

    setFilteredMovies(updatedMovies);

    setCurrentPage(1);

  }, [search, selectedFilter, movies]);

  // ── Pagination ──
  const totalPages = Math.ceil(
    filteredMovies.length / MOVIES_PER_PAGE
  );

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  // ── Star Rating ──
  const renderStars = (rating) => {

    const stars = Math.round(rating / 2);

    return (
      "★".repeat(stars) +
      "☆".repeat(5 - stars)
    );
  };

  // ── Rating Color ──
  const getRatingColor = (rating) => {

    if (rating >= 7.5) return "rating-green";

    if (rating >= 5) return "rating-yellow";

    return "rating-red";
  };

  return (

    <div className="dashboard">

      {/* ── Navbar ── */}
      <nav className="navbar">

        <div className="navbar-left">

          <span className="navbar-logo">
            🎬
          </span>

          <h1 className="navbar-title">
            CINEMA DASHBOARD
          </h1>

        </div>

        <div className="navbar-right">

          {user && (

            <div className="user-badge">

              <span className="user-avatar">

                {user.username
                  ?.charAt(0)
                  .toUpperCase()}

              </span>

              <span className="user-name">
                {user.username}
              </span>

            </div>
          )}

          <button
            className="logout-btn"
            onClick={logout}
          >
            ⏻ Logout
          </button>

        </div>

      </nav>

      {/* ── Hero ── */}
      <div className="hero">

        <div className="hero-content">

          <h2>
            🍿 Trending Movies
          </h2>

          <p>
            Discover trending movies,
            search and explore details.
          </p>

        </div>

        <div className="hero-stats">

          <div className="stat">

            <span className="stat-number">
              {movies.length}
            </span>

            <span className="stat-label">
              Total
            </span>

          </div>

          <div className="stat">

            <span className="stat-number">
              {filteredMovies.length}
            </span>

            <span className="stat-label">
              Showing
            </span>

          </div>

          <div className="stat">

            <span className="stat-number">
              {
                movies.filter(
                  (m) => m.vote_average >= 7
                ).length
              }
            </span>

            <span className="stat-label">
              Top Rated
            </span>

          </div>

        </div>

      </div>

      {/* ── Controls ── */}
      <div className="controls">

        {/* Search */}
        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (

            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}

        </div>

        {/* Filter */}
        <div className="select-wrapper">

          <span className="select-icon">
            🎚️
          </span>

          <select
            value={selectedFilter}
            onChange={(e) =>
              setSelectedFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Movies
            </option>

            <option value="Top Rated">
              ⭐ Top Rated
            </option>

            <option value="Popular">
              🔥 Popular
            </option>

          </select>

        </div>

        {/* View Toggle */}
        <div className="view-toggle">

          <button
            className={
              viewMode === "grid"
                ? "active"
                : ""
            }
            onClick={() =>
              setViewMode("grid")
            }
          >
            ⊞
          </button>

          <button
            className={
              viewMode === "list"
                ? "active"
                : ""
            }
            onClick={() =>
              setViewMode("list")
            }
          >
            ☰
          </button>

        </div>

      </div>

      {/* ── Loading ── */}
      {loading && (

        <div className="loading-screen">

          <div className="loader"></div>

          <p>
            Fetching trending movies...
          </p>

        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (

        <div className="error-screen">

          <span>😕</span>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Retry
          </button>

        </div>
      )}

      {/* ── Empty ── */}
      {!loading &&
        !error &&
        filteredMovies.length === 0 && (

        <div className="empty-screen">

          <span>🎭</span>

          <p>
            No movies found for "
            {search}"
          </p>

          <button
            onClick={() => {

              setSearch("");

              setSelectedFilter("All");
            }}
          >
            Clear Filters
          </button>

        </div>
      )}

      {/* ── Movies ── */}
      {!loading &&
        !error &&
        filteredMovies.length > 0 && (

        <div
          className={`movie-container ${
            viewMode === "list"
              ? "list-view"
              : "grid-view"
          }`}
        >

          {paginatedMovies.map((movie) => (

            <div
              className="movie-card"
              key={movie.id}
              onClick={() =>
                setSelectedMovie(movie)
              }
            >

              <div className="movie-poster">

                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title}
                />

                <div className="movie-overlay">

                  <button className="view-btn">
                    👁 View Details
                  </button>

                </div>

                <div
                  className={`rating-badge ${getRatingColor(
                    movie.vote_average
                  )}`}
                >
                  ⭐ {movie.vote_average.toFixed(1)}
                </div>

              </div>

              <div className="movie-info">

                <h3>{movie.title}</h3>

                <p className="stars">
                  {renderStars(
                    movie.vote_average
                  )}
                </p>

                <p className="release-date">
                  📅{" "}
                  {movie.release_date ||
                    "Unknown"}
                </p>

                <p className="overview">

                  {movie.overview
                    ? movie.overview.substring(
                        0,
                        100
                      ) + "..."
                    : "No description available."}

                </p>

                <div className="movie-footer">

                  <span className="popularity">
                    🔥{" "}
                    {Math.round(
                      movie.popularity
                    )}
                  </span>

                  <span
                    className={`vote-count ${getRatingColor(
                      movie.vote_average
                    )}`}
                  >
                    {movie.vote_average.toFixed(
                      1
                    )}{" "}
                    / 10
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (

        <div className="pagination">

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.max(p - 1, 1)
              )
            }
            disabled={currentPage === 1}
          >
            ← Prev
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((page) => (

            <button
              key={page}
              className={
                currentPage === page
                  ? "page-active"
                  : ""
              }
              onClick={() =>
                setCurrentPage(page)
              }
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(
                  p + 1,
                  totalPages
                )
              )
            }
            disabled={
              currentPage === totalPages
            }
          >
            Next →
          </button>

        </div>
      )}

      {/* ── Modal ── */}
      {selectedMovie && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedMovie(null)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedMovie(null)
              }
            >
              ✕
            </button>

            <div className="modal-content">

              <img
                src={
                  selectedMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={selectedMovie.title}
              />

              <div className="modal-details">

                <h2>
                  {selectedMovie.title}
                </h2>

                <p className="modal-stars">
                  {renderStars(
                    selectedMovie.vote_average
                  )}
                </p>

                <div className="modal-meta">

                  <span>
                    ⭐{" "}
                    {selectedMovie.vote_average.toFixed(
                      1
                    )}{" "}
                    / 10
                  </span>

                  <span>
                    🔥{" "}
                    {Math.round(
                      selectedMovie.popularity
                    )}
                  </span>

                  <span>
                    📅{" "}
                    {selectedMovie.release_date ||
                      "Unknown"}
                  </span>

                </div>

                <p className="modal-overview">
                  {selectedMovie.overview}
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ── Footer ── */}
      <footer className="footer">

        <p>
          🎬 MovieDash ©{" "}
          {new Date().getFullYear()}
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;