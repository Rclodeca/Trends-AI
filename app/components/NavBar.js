import { GithubButton } from "./buttons"

export default function NavBar() {

    return (
        <div class="fixed top-0 left-0 w-full h-12 bg-gray-800 text-white shadow-lg">
            <div class="max-w-screen-lg mx-auto px-4 py-1 flex items-center justify-between">
        
            <div class="text-lg font-bold">
                Trends<span class="text-blue-500">AI</span>
            </div>
        
            <nav class="space-x-4 hidden md:block">
                <GithubButton />
            </nav>
        
            </div>
        </div>
    )
}