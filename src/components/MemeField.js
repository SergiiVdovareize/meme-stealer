import { useEffect, useState } from "react";
import StealingService from "../utils/StealService";

const defaultStealingButtonLabel = 'Steal'
const MemeField = () => {
    const [isStealing, setIsStealing] = useState(false)
    const [stealingButtonLabel, setStealingButtonLabel] = useState(defaultStealingButtonLabel)

    useEffect(() => {
        if (isStealing) {
            setStealingButtonLabel('Stealing.....')
        } else {
            setStealingButtonLabel(defaultStealingButtonLabel)
        }
    }, [isStealing])

    const downloadURI = (uri, name) => {
        var link = document.createElement("a");
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        setIsStealing(true)
        const form = event.target;
        const formData = new FormData(form);
        const result = await StealingService.stealMeme(formData.get('source'))
        setIsStealing(false)
        if (result.success === true && result.data) {
            downloadURI(result.data)
        }

        return false;
    }

    return <div className='container'>
        <form action="#" onSubmit={stealMeme}>
            {/* <input type="text" className='meme-source' value={contentUrl} onChange={contentUrlChangeHandler}/> */}
            <textarea rows={4} name='source' className='meme-source' placeholder="Paste url here"></textarea>
            <input type="submit" disabled={isStealing} className='meme-stealer' value={stealingButtonLabel}/>
        </form>
    </div>
}

export default MemeField;