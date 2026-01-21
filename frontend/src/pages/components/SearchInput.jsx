import { useState, useEffect } from "react";

function SearchInput({ onSearch, onSearching }) {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(inputValue);
            if (onSearching) onSearching(false);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, onSearch, onSearching]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        if (onSearching) onSearching(true);
    };

    return (
        <div className="search-wrapper">
            <input
                type="text"
                placeholder="Search products..."
                value={inputValue}
                onChange={handleChange}
                className="search-input"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
    );
}

export default SearchInput;
