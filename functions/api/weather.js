export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // Get coordinates from query parameters
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    
    if (!lat || !lon) {
        return new Response(JSON.stringify({ error: 'Missing coordinates' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        // Get API key from Cloudflare environment variables
        const OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY;
        
        // Make request to OpenWeather API
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`OpenWeather API error: ${response.status}`);
        }
        
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
