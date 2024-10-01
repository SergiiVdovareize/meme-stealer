import { useEffect, useState } from "react";
import StealingService from "../utils/StealService";

const defaultStealingButtonLabel = 'Steal me'

const MemeField = () => {
    const [isStealing, setIsStealing] = useState(false)
    const [isError, setIsError] = useState(false)
    const [urlValue, setUrlValue] = useState('')
    const [stealingButtonLabel, setStealingButtonLabel] = useState(defaultStealingButtonLabel)

    useEffect(() => {
        if (isStealing) {
            setStealingButtonLabel('Stealing.....')
        } else {
            setStealingButtonLabel(defaultStealingButtonLabel)
        }
    }, [isStealing])

    // useEffect(() => {
    //     document.addEventListener("visibilitychange", (data) => {
    //         console.log('VISIBILITY', document.visibilityState)
    //     })
    // }, [])

    const handleUrlChange = (event) => {
        setIsError(false)
        setUrlValue(event.target.value);
    }

    const resetForm = () => {
        setUrlValue('')
        setIsError(false)
    }

    const downloadURI = (uri, name) => {
        var link = document.createElement("a");
        link.href = uri;
        // link.download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const downloadFile = (url, filename) => {
        fetch(url)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob(); // Convert response to a Blob object
            })
            .then(blob => {
            // Create a temporary URL for the Blob
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename || url.split('/').pop(); // Use the provided filename or extract from URL
            document.body.appendChild(a);
            a.click();
            a.remove();
                window.URL.revokeObjectURL(downloadUrl); // Clean up the temporary URL
            })
            .catch(console.error);
    }

    // const animateStealing = () => {
    //     console.log('stealingButtonLabel', stealingButtonLabel)
    //     if (stealingButtonLabel.length > defaultStealingButtonLabel.length + 5) {
    //         setStealingButtonLabel(defaultStealingButtonLabel)
    //     } else {
    //         setStealingButtonLabel(`wefew2`)
    //         setTimeout(animateStealing, 200)
    //     }
    // }

    const stealMeme = async (event) => {
        event.preventDefault()
        
        const sanitizedSource = validateMeme(urlValue)
        if (!sanitizedSource) {
            setIsError(true)
            return;
        }

        setIsStealing(true)
        const result = await StealingService.stealMeme(sanitizedSource)
        setIsStealing(false)
        if (result.success === true && result.data) {
            downloadURI(result.data)
        }

        return false;
    }

    const validateMeme = (url) => {
        const urlPatterns = {
            tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
            instagramPost: /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+/,
            instagramReel: /^https?:\/\/(www\.)?instagram\.com\/reels?\/[\w-]+/,
            twitter: /^https?:\/\/(www\.)?twitter\.com\/[\w.-]+\/status\/\d+/,
            youtubeVideo: /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
            youtubeShorts: /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/
        };

        const trimmedUrl = url.trim();

        // Check if the URL matches any of the patterns
        const isValid = Object.values(urlPatterns).some(pattern => pattern.test(trimmedUrl));

        if (!isValid) {
            console.error('Invalid video URL. Please provide a valid TikTok, Instagram, Twitter, or YouTube video URL.', )
            console.error(`You tried this. "${url}"`)
            return null
        }

        const urlObj = new URL(trimmedUrl);

        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.pathname.startsWith('/watch') && urlObj.searchParams.has('v')) {
              urlObj.search = `?v=${urlObj.searchParams.get('v')}`;
            } else if (urlObj.pathname.startsWith('/shorts')) {
              urlObj.search = ''; // No query params needed for YouTube Shorts
            }
          } else {
            urlObj.search = ''; // Remove query params for other platforms
          }

          return urlObj.toString();
    }

    const pasteMeme = async () => {
        const text = await navigator.clipboard.readText();
        setUrlValue(text)
        setIsError(false)
    }

    return <div className='container'>
        <form action="#" onSubmit={stealMeme} className={isError ? 'error-form' : null}>
            {/* <input type="text" className='meme-source' value={contentUrl} onChange={contentUrlChangeHandler}/> */}
            <textarea rows={4} name='source' className='meme-source' placeholder="Paste url here" value={urlValue} onChange={handleUrlChange}/>
            
            <div className="stealing-buttons-wrapper">
                <input type="reset" disabled={isStealing} className='stealing-button' value='Reset' onClick={resetForm}/>
                <input type="button" disabled={isStealing} className='stealing-button' value='Paste' onClick={pasteMeme}/>
                <input type="submit" disabled={isStealing} className='stealing-button meme-stealer' value={stealingButtonLabel}/>
            </div>
        </form>
    </div>
}

export default MemeField;