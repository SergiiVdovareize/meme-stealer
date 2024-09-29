import { useState } from "react";
import StealingService from "../utils/StealService";

const MemeField = () => {
    const downloadURI = (uri, name) => {
        var link = document.createElement("a");
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    const stealMeme = async (event) => {
        event.preventDefault()
        const form = event.target;
        const formData = new FormData(form);
        const result = await StealingService.stealMeme(formData.get('source'))
        if (result.success === true && result.data) {
            downloadURI(result.data)
        }

        return false;
    }

    return <div className='container'>
        <form action="#" onSubmit={stealMeme}>
            {/* <input type="text" className='meme-source' value={contentUrl} onChange={contentUrlChangeHandler}/> */}
            <textarea rows={4} name='source' className='meme-source' placeholder="Paste url here"></textarea>
            <input type="submit" className='meme-stealer' value='Steal'/>
        </form>
    </div>
}

export default MemeField;