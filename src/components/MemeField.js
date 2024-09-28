import { useState } from "react";
import StealingService from "../utils/StealService";

const MemeField = () => {
    const [contentUrl, setContentUrl] = useState('')

    const downloadURI = (uri, name) => {
        var link = document.createElement("a");
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    const steamMeme = async (event) => {
        event.preventDefault()
        const memeStaticUrl = await StealingService.stealMeme(contentUrl)

        downloadURI(memeStaticUrl, 'test')
        return false
    }

    const contentUrlChangeHandler = (event) => {
        setContentUrl(event.target.value);
    }

    return <div>
        <form action="#" onSubmit={steamMeme}>
            <input type="text" value={contentUrl} onChange={contentUrlChangeHandler}/>
            <input type="submit" value='Steal'/>
        </form>
    </div>
}

export default MemeField;