"use client";
import { useState } from "react";

export default function SideBar({ interests, addInterest, removeInterest }) {
    const [addText, setAddText] = useState("");

    function handleAddInterest(e) {
        e.preventDefault();
        if (addText.trim() && !interests.includes(addText)) {
            addInterest(addText);
        }
        setAddText("");
    }

    function handleRemoveInterest(interest) {
        removeInterest(interest);
    }

    function handleAddText(e) {
        e.preventDefault();
        const input = e.target.value;
        setAddText(input);
    }

    return (
        <div className="w-64 bg-gray-900 text-white p-4">
            <h2 className="text-lg font-bold mb-4">Interests</h2>
            <form className="relative w-full my-2 group">
                <input
                    type="text"
                    value={addText}
                    onChange={handleAddText}
                    className="w-full rounded p-2 pr-12 focus:outline-none bg-gray-800"
                    placeholder="New interest..."
                />
                <button
                    onClick={handleAddInterest}
                    type="submit"
                    className={`${addText.length ? "opacity-100" : "opacity-0"} absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-0.5 rounded hover:bg-blue-600`}
                >
                    Add
                </button>
            </form>
            <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                    <div 
                        className="text-left p-2 bg-gray-800 rounded hover:bg-gray-600  group"
                        key={i}
                    >
                        <span className="text-white  group-hover:text-opacity-20">
                            {interest}
                        </span>
                        <button 
                            className="text-gray-600 font-extrabold text-xs ml-2 group-hover:text-red-800 group-hover:inline"
                            onClick={() => handleRemoveInterest(interest)}
                        >
                            &#x2715;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
