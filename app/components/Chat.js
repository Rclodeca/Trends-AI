
function SystemMessage({ topic, summary, index }) {
    topic = topic.charAt(0).toUpperCase() + topic.slice(1);
    return (
        <div class="mb-4 p-5 bg-gray-950 hover:bg-gray-900 rounded-lg w-lg" key={index}>
            <h3 class="pb-2 text-lg font-bold text-blue-500">{topic}</h3>
            <p class="">{wrapBulletPointsWithUl(summary)}</p>
        </div>
    )
}

function UserMessage({ message, index }) {
    return (
        <div class="mb-4 text-right" key={index}>
            <div class="bg-gray-700 text-grey-200 p-3 rounded-lg w-fit ml-auto">{message}</div>
        </div>
    )
}

function wrapBulletPointsWithUl(inputString) {
    const lines = inputString.split("\n");
  
    return (
        <ul className="list-none leading-relaxed">
            {lines.map(line => {
                if (line.startsWith("- ")) {
                    return (
                        <li className="my-2 before:content-['→'] before:text-red-400 before:mr-2">
                            {line.slice(2).trim()}
                        </li>
                    )
                } else {
                    return line
                }
            })}
        </ul>
    )
}

  

export default function Chat({ feed }) {
    return (
        <div class="flex flex-col flex-1 bg-gray-950 text-gray-200">
            <div class="w-full flex-1 overflow-y-auto m-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">
                <div class="max-w-screen-md m-auto p-4">
                    {feed.map((message, index) => (
                        <SystemMessage topic={message.topic} summary={message.summary} index={index} />
                    ))}
                </div>
            </div>
        
            <div class="py-4 px-2 max-w-screen-md m-auto w-full">
                <form class="relative w-full">
                    <input
                        type="text"
                        class="w-full rounded-lg p-3 pr-12 focus:outline-none bg-gray-800"
                        placeholder="Type something..."
                    />
                    <button
                        type="submit"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    )
}
