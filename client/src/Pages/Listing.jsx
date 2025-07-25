import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from "react-redux";
import { FaBath, FaBed, FaChair, FaMapMarkedAlt, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import Contact from "../components/Contact";


export default function Listing() {
    const { currentUser} = useSelector(state => state.user);
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contactLandLord, setContactLandLord] = useState(false);
    const params = useParams();
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId])
    // console.log(loading);
    // console.log(listing);
   console.log(currentUser._id);
   console.log(listing);
   console.log(contactLandLord);
   
   
   

    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl font-semibold">Loading...</p>}
            {error && <p className="text-center my-7 text-2xl text-red-700">Something went wrong!</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[550px]'
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="fixed top-[13%] right-[13%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                        <FaShare className="text-slate-700" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }} />
                    </div>
                    {copied && (
                        <p className="fixed top-[13%] right-[30%] z-10 rounded-md bg-slate-100 p-2">Link Copied!!</p>
                    )}
                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    ${+listing.regularPrice - +listing.discountPrice}
                                     {' discount'}
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className="text-lg" />
                                { listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBath className="text-lg" />
                                { listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaParking className="text-lg" />
                                { listing.parking ? 'parking Spot ' : 'No parking' }
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaChair className="text-lg" />
                                { listing.furnished ? 'Furnished' : 'Unfurnished' }
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id  && !contactLandLord &&(
                            <button onClick={()=> setContactLandLord(true)} className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-90">
                                Contact Landlord
                            </button>
                        )}
                        {contactLandLord && <Contact listing={listing} /> }
                    </div>
                </div>
            )
            }
        </main >
    );
}
