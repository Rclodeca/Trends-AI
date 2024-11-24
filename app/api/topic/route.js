import { getTopics, addTopic, deleteTopic } from "@/lib/topic";
import { jsonResponse } from "@/utils/responseHelpers";


export async function GET() {
    const LOG_PREFIX = "GET /topic handler:";
    
    try {
        const topics = await getTopics();
        return jsonResponse(topics);
    } 
    catch (error) {
        console.error(LOG_PREFIX, "Error:" + error);
        return jsonResponse("Internal Server Error", 500);
    }
}

export async function POST(req) {
    const LOG_PREFIX = "POST /topic handler:";
    
    try {
        const body = await req.json();
        const { topic } = body
        if(!topic) {
            return jsonResponse("Topic is required", 400);
        }

        const topics = await getTopics();
        if(!topics.includes(topic)) {
            await addTopic(topic)
        }

        return jsonResponse();
    } 
    catch (error) {
        console.error(LOG_PREFIX, "Error:" + error);
        return jsonResponse("Internal Server Error", 500);
    }
}

export async function DELETE(req) {
    const LOG_PREFIX = "POST /topic handler:";
    const { searchParams } = new URL(req.url);
    const topicName = searchParams.get('name');

    if(!topicName) {
        return jsonResponse("Topic is required", 400);
    }
    
    try {
        await deleteTopic(topicName)

        return jsonResponse();
    } 
    catch (error) {
        console.error(LOG_PREFIX, "Error:" + error);
        return jsonResponse("Internal Server Error", 500);
    }
}

