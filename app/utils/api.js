export async function fetchInterests() {
    const response = await fetch('/api/topic');
    return response.json();
}

export async function fetchFeed() {
    const response = await fetch('/api/feed');
    return response.json();
}

export async function postInterest(newInterest) {
    const response = await fetch("/api/topic", {
        method: "POST",
        body: JSON.stringify({ topic: newInterest }),
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function deleteInterest(topicToRemove) {
    const response = await fetch(`/api/topic/${topicToRemove}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
} 