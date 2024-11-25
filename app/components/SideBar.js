"use client";
import { PlusIcon } from "./icons";

export default function SideBar({ interests, addInterest, removeInterest }) {

    function handleAddInterest(e) {
        e.preventDefault();
        const form = e.target;
        const input = form.interest.value;
        addInterest(input);
    }

    function handleRemoveInterest(interest) {
        removeInterest(interest);
    }

    return (
        <div class="w-64 bg-gray-900 text-white p-4">
            <h2 class="text-lg font-bold mb-4">Interests</h2>
            <form class="relative w-full my-2 group">
                <input
                    type="text"
                    class="w-full rounded p-2 pr-12 focus:outline-none bg-gray-800"
                    placeholder="New interest..."
                />
                <button
                    onClick={handleAddInterest}
                    type="submit"
                    class="absolute opacity-0 group-hover:opacity-100 right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-0.5 rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </form>
            <div class="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                    <div 
                        class="text-left p-2 bg-gray-800 rounded hover:bg-gray-600  group"
                        key={i}
                    >
                        <span class="text-white  group-hover:text-opacity-20">
                            {interest}
                        </span>
                        <button 
                            class="text-gray-600 font-extrabold text-xs ml-2 group-hover:text-red-800 group-hover:inline"
                            onClick={() => handleRemoveInterest(i)}
                        >
                            &#x2715;
                        </button>
                    </div>
                ))}
                <div>
                    <button class="flex items-center space-x-2 text-left p-2 bg-gray-800 rounded hover:bg-gray-600">
                        <PlusIcon />
                        <span>New</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
