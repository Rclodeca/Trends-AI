import axios from 'axios';

function getOneMonthAgo() {
    return new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]; // 30 days ago
}

function getToday() {
    return new Date().toISOString().split('T')[0]; // Today
}

export async function getArticlesByTopic(topic) {
    const LOG_PREFIX = "getArticlesByTopic():"
    const newsAPIKey = process.env.NEWS_API_KEY;

    try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                q: topic,
                apiKey: newsAPIKey,
                sortBy: "popularity",
                from: getOneMonthAgo(),
                to: getToday(),
                pageSize: 100,
            },
        });

        const articles = response.data.articles
            .filter(art => art.description !== "[Removed]")
            .map(art => {
                return {
                    title: art.title,
                    description: art.description,
                    content: art.content
                }
            });
        
        if(!articles.length) {
            console.log(`${LOG_PREFIX} No articles fetched for topic: ${topic}`)
            return null
        }

        console.log(`${LOG_PREFIX} Fetched new articles for topic: ${topic}`)
        return articles;
    } 
    catch (error) {
        console.error(`${LOG_PREFIX} Error fetching articles for topic: ${topic}`, error);
        return null;
    }
}
