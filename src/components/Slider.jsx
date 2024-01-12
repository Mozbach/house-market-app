import {useState, useEffect} from 'react';
import{useNavigate} from 'react-router-dom';
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore';
import {db} from '../firebase.config';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import Spinner from './Spinner';

function Slider() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {

            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnap = await getDocs(q); 
            
            let listings = [];
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings(listings);
            setLoading(false);
        }
        fetchListings();
    }, []);

    if(loading) {
        return ( <Spinner /> );
    }

    if(listings.length === 0) {
        return ( <></> );
    }

  return (
    listings && (
        <>
            <p className="exploreHeading">Recommended</p>

            <Swiper slidesPerView={1} pagination={{clickable: true}}>
                {listings.map(({data, id}) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div className="swiperSlideDiv"
                            style={{
                                background: `url(${data.imgUrls[0]}) center no-repeat`,
                                backgroundSize: 'cover',
                                minHeight: '20rem'
                            }}
                        >

                            <p className="swiperSlideText">{data.name}</p>
                            <p className="swiperSlidePrice">
                                ${data.discountedPrice ?? data.regularPrice}
                                { ' ' }
                                {data.type === 'rent' && ' per month'}
                            </p>


                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
  )
}

export default Slider

// just a note. I had an issue where eslint and it's dramatic non-informative error screen showed me that it couldn't find the 'imgUrls[0]' data from the server. Turns out, when the lecturer, Brad Trevares? ? -> initially had you set up the first entry on the database, he named the imgUrls entry "imageUrls", so that one listing broke the whole "Offers" page and anywhere else I needed to access imgUrls[0]. Just happy I figured it out, I simply deleted the whole document off the database and it works fine now.