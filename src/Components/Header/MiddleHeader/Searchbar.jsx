import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [focused, setFocused]   = useState(false);
  const [query, setQuery]       = useState("");
  const navigate                = useNavigate();

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/listing?search=${encodeURIComponent(q)}`);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={`hidden md:flex flex-1 rounded-2xl overflow-hidden border bg-gray-50 transition-all duration-200 ${focused ? "border-sky-400 ring-2 ring-sky-100" : "border-gray-200"}`}>
      <button className="hidden lg:flex items-center gap-1.5 pl-4 pr-3.5 border-r border-gray-200 text-[11.5px] font-bold text-gray-500 hover:text-sky-600 transition-colors whitespace-nowrap shrink-0 py-3">
        All <ChevronDown size={10} />
      </button>
      <div className="relative flex-1 flex items-center">
        <Search size={15} className={`absolute left-3.5 transition-colors ${focused ? "text-sky-500" : "text-gray-300"}`} />
        <input
          type="text"
          value={query}
          placeholder="Search products, brands, categories..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent py-3 pl-9 pr-4 text-[13.5px] outline-none text-gray-700 placeholder-gray-400 font-medium"
        />
      </div>
      <button
        onClick={handleSearch}
        className="m-1.5 px-5 py-2 rounded-xl text-white text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 bg-gradient-to-r from-sky-400 to-blue-600"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;