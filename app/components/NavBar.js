import { GithubButton } from "./buttons"

export default function NavBar() {

    return (
        <div className="w-full h-12 bg-gray-800 text-white shadow-lg">
            <div className="max-w-screen-lg mx-auto px-4 py-1 flex items-center justify-between">
        
            <div className="text-lg font-bold">
                Trends<span className="text-blue-500">AI</span>
            </div>
        
            <nav className="space-x-4 hidden md:block">
                <GithubButton />
            </nav>
        
            </div>
        </div>
    )
}