import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        offer: false,
        furnished: false,
        parking: false,
        sort: 'createdAt',
        order: 'desc',
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    console.log(listings);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const offerFromUrl = urlParams.get('offer');
        const furnishedFromUrl = urlParams.get('furnished');
        const parkingFromUrl = urlParams.get('parking');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || typeFromUrl || offerFromUrl || furnishedFromUrl || parkingFromUrl || sortFromUrl || orderFromUrl) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                offer: offerFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                parking: parkingFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        }
        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
            setSidebardata({
                ...sidebardata, type: e.target.id,
            });
        }
        if (e.target.id === 'searchTerm') {
            setSidebardata({
                ...sidebardata, searchTerm: e.target.value,
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({
                ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({ ...sidebardata, sort, order });
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    const onShowMoreClick = async () => {
        const numberofListings = listings.length;
        const startIndex = numberofListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 9) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7  border-b-2 md:border-r-2 border-gray-300 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type:</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='all' className='w-5' onChange={handleChange} checked={sidebardata.type === 'all'} />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sidebardata.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={sidebardata.type === 'sale'} />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={sidebardata.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={sidebardata.parking} />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={sidebardata.furnished} />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select onChange={handleChange} defaultValue={'createdAt_desc'} id='sort_order' className='border rounded-lg p-3'>
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to hight</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b border-gray-300 p-3 text-slate-700 mt-5'>Listing results:</h1>
                <div className="flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    )}
                    {!loading && listings && listings.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}
                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-7 text-center w-full'
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}