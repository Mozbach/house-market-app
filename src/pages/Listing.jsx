import {useState, useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {getDoc, doc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {db} from '../firebase.config';
import Spinner from '../components/Spinner.jsx';
import shareIcon from '../assets/svg/shareIcon.svg';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';

function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkcopied, setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
    }, [navigate, params.listingId]);

    if(loading) {
        return ( <Spinner /> );
    }

  return (
    <main>
        <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            pagination={{clickable: true}}
            >
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div style={{
                            background: `url(${listing.imgUrls[index]}) center no-repeat`,
                            minHeight: '20rem',
                            backgroundSize: 'cover',
                        }} className="swiperSlideDiv"
                            ></div>
                    </SwiperSlide>
                ))}

        </Swiper>

        <div className="shareIconDiv" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
                setShareLinkCopied(false);
            }, 2000);
        }}>
            <img src={shareIcon} alt="" />
        </div>

        {shareLinkcopied && <p className="linkCopied">Link Copied!</p>}

        <div className="listingDetails">
            <p className="listingName">{listing.name} : R{listing.offer
            ? listing.discountedPrice.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            
            }</p>
            <p className="listingLocation">{listing.location}</p>
            <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
            {listing.offer && (
                <p className="discountPrice">
                    R{listing.regularPrice - listing.discountedPrice} Discount!
                </p>
            )}

            <ul className="listingDetailsList">
                <li>
                    {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                </li>
                <li>
                    {listing.bathrooms > 1 ? `${listing.bathrooms} Bathroom` : '1 Bathroom'}
                </li>
                <li>{listing.parking && 'Parking Spot'}</li>
                <li>{listing.furnished && 'Fully Furnished'}</li>
            </ul>
            <p className="listingLocationTitle">Location</p>
            
            <div className="leafletContainer">
                <MapContainer style={{
                    height: '100%',
                    width: '100%'
                }}
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={true}
                >
                    <TileLayer attribution='&copy;
                        <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />
                    <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                        <Popup>{listing.location}</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {auth.currentUser?.uid !== listing.userRef && (
                <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">
                    Conatct Landlord
                </Link>
            )}
        </div>
    </main>
  )
}

export default Listing