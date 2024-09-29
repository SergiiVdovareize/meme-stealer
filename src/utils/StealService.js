import Constants from "./Constants";

const getResult = async (url) => {
    try {
        const data = await fetch(url)
        const json = await data.json()
        if (json.type === 'sync') {
            return json.data;
        }

        if (json.type === 'async') {
            return await getAsyncResult(`${Constants.RESULT_URL}/${json.data}`)
        }

        return {
            success: false,
            message: json.message || 'unknown issue',
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

const getAsyncResult = async (url) => {
    try {
        const data = await fetch(url)
        const json = await data.json()
        
        if (json.success) {
            return json
        }

        if (!json.success && json.status === 2) {
            return await getAsyncResult(url);
        }

        return {
            success: false,
            message: 'unknown issue',
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        }
    }
}

const StealingService = {
    async stealMeme(memeUrl) {
        return await getResult(`${Constants.MEME_STEALER_URL}/${encodeURIComponent(memeUrl)}`)
    }
}



export default StealingService