
function SystemMessage({ topic, summary, index }) {
    topic = topic.charAt(0).toUpperCase() + topic.slice(1);
    return (
        <div class="mb-4 p-3 text-white rounded-lg w-lg" key={index}>
            <h3 class="py-2 font-bold text-blue-500">{topic}</h3>
            <p class="">{wrapBulletPointsWithUl(summary)}</p>
        </div>
    )
}

function UserMessage({ message, index }) {
    return (
        <div class="mb-4 text-right" key={index}>
            <div class="bg-gray-800 text-grey-300 p-3 rounded-lg w-fit ml-auto">{message}</div>
        </div>
    )
}

function wrapBulletPointsWithUl(inputString) {
    const lines = inputString.split("\n");
  
    return (
        <ul className="list-disc">
            {lines.map(line => {
                if (line.startsWith("- ")) {
                    return <li className="ml-4 my-1">{line.slice(2).trim()}</li>
                } else {
                    return line
                }
            })}
        </ul>
    )
}

  

export default function Chat({ feed }) {
    return (
        <div class="flex flex-col flex-1 dark:bg-gray-950 dark:text-white">
            <div class="flex-1 overflow-y-auto p-4 max-w-screen-md m-auto">
                {feed.map((message, index) => (
                    <SystemMessage topic={message.topic} summary={message.summary} index={index} />
                ))}
            </div>
        
            <div class="p-4 max-w-screen-md m-auto w-full">
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
