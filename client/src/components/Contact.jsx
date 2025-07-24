import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init("yRHpy7RQ0i_UklOqK");

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_vlhlash";  // Your service ID
const EMAILJS_TEMPLATE_ID = "template_6yalwqb"; // Your template ID

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccess(false);
    }

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(data.message);
                    return;
                }
                setLandlord(data);
            } catch (error) {
                setError('Error fetching landlord information');
            }
        }
        fetchLandlord();
    }, [listing.userRef])

    const handleContact = async (e) => {
        e.preventDefault();
        
        // Validate all required fields
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!formData.email.trim()) {
            setError('Please enter your email');
            return;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number');
            return;
        }
        if (!formData.message.trim()) {
            setError('Please enter a message');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const templateParams = {
                from_name: formData.name,
                to_name: landlord.username,
                message: `
Property: ${listing.name}

Message: ${formData.message}

Contact Details:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}`,
                reply_to: formData.email,
                to_email: landlord.email
            };

            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            if (result.text === 'OK') {
                setSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                // Set a timeout to hide the form and success message after 2 seconds
                setTimeout(() => {
                    setSuccess(false);
                    setShowForm(false);
                }, 2000);
            }
        } catch (error) {
            setError('Failed to send message. Please try again.');
            console.error('EmailJS error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className='bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95'
                        >
                            Contact Landlord
                        </button>
                    ) : (
                        <>
                            <p>
                                Contact <span className='font-semibold'>{landlord.username}</span>{' '}
                                for{' '}
                                <span className='font-semibold'>{listing.name.toLowerCase()}</span>
                            </p>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={onChange}
                                className='w-full border p-3 rounded-lg'
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your email address"
                                value={formData.email}
                                onChange={onChange}
                                className='w-full border p-3 rounded-lg'
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Your phone number"
                                value={formData.phone}
                                onChange={onChange}
                                className='w-full border p-3 rounded-lg'
                                required
                            />
                            <textarea 
                                name="message"  
                                id="message" 
                                rows='2' 
                                placeholder='Enter your message here...' 
                                value={formData.message} 
                                onChange={onChange} 
                                className='w-full border p-3 rounded-lg'
                                required
                            />
                            
                            <button
                                onClick={handleContact}
                                disabled={loading}
                                className='bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95 active:opacity-80 disabled:opacity-80'
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>

                            {error && (
                                <p className='text-red-700 text-sm'>{error}</p>
                            )}
                            {success && (
                                <p className='text-green-700 text-sm'>Message sent successfully!</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    )
}