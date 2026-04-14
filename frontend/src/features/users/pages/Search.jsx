import { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import debounce from "lodash/debounce";
import { useUser } from "../hooks/useUser";
import SearchUserTile from "../components/SearchUserTile";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const { handleSearchUser } = useUser();

  const fetchSearchResults = async (searchText) => {
    setLoading(true);
    const users = await handleSearchUser(searchText);
    setResults(users);
    setLoading(false);
  };

  const debouncedSearch = useMemo(
    () => debounce((q) => fetchSearchResults(q), 400),
    []
  );

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return (
    <div className="max-w-[470px] mx-auto px-4 py-6 min-h-screen">
      {/* Search Header */}
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-5">
        Search
      </h1>

      {/* Search Input */}
      <div
        className={`flex items-center gap-3 bg-gray-100 rounded-lg px-4 h-11 transition-all duration-200 ${
          focused ? "ring-1 ring-gray-300 bg-gray-50" : ""
        }`}
      >
        <SearchIcon size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search"
          className="bg-transparent outline-none w-full text-sm text-gray-900 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center hover:bg-gray-500 transition-colors"
          >
            <X size={12} className="text-white" strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-4">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          </div>
        )}

        {/* No results */}
        {!loading && query && results.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              No results found.
            </p>
            <p className="text-sm text-gray-400">
              Try searching for a different username.
            </p>
          </div>
        )}

        {/* Result tiles */}
        {!loading &&
          results.map((user) => (
            <SearchUserTile key={user._id} user={user} />
          ))}

        {/* Empty state */}
        {!query && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4">
              <SearchIcon size={28} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-gray-400 text-center">
              Search for people to follow
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
