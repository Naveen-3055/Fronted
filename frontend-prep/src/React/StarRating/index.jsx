


export default function StarRating({totalStars=5, readOnly=false}){

    const stars = Array.from({length: totalStars}, (_,index)=> index+1);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleRating = (star,e)=>{
         if(readOnly) return;

       
       
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeftHalf = e.clientX - rect.left < rect.width/2;

        const newRating = isLeftHalf ? star - 0.5 : star;

        setRating(newRating);
    }

    const handleHover = (e,star)=> {
        if(readOnly) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeftHalf = e.clientX - rect.left < rect.width/2;
        const newRating = isLeftHalf ? star - 0.5 : star;
        setHover(newRating);
    }

   



    return (
        <div>
            {stars.map((star, index)=> {
                const fill = Math.max(0, Math.min(1, (hover||rating)-star+1))*100;
                return(
                    <button 
                    key={star} 
                    type="button"
                    disabled={readOnly}
                    aria-label={`Rate ${star} out of ${totalStars}`}
                    aria-pressed={rating === star}
                    onClick={(e)=> handleRating(star,e)} 
                    onMouseMove={(e) => handleHover(star,e)} 
                    onMouseLeave={() => setHover(0)}
                    >
                        <span 
                        style={{
                            background: `linear-gradient(90deg, 
                            #f5b301 ${fill}%, #ccc ${fill}%
                            )`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            webkitTextFillColor: "transparent"
                        }}>
                            ☆
                        </span>
                    </button>
                )
            })}
        </div>
    )
}