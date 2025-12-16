import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Loading from '../../components/student/Loading'

const MyAffiliate = () => {
    const { userData, currency } = useContext(AppContext)

    if (!userData) return <Loading />

    const affiliateLink = `${window.location.origin}/course-list?ref=${userData._id}`

    return (
        <div className='h-screen flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='space-y-5'>
                <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                    <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Affiliate Dashboard</h2>
                    <p className='text-gray-600 mb-6'>Share your unique link and earn 5% commission on every course purchased through it.</p>

                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className='flex-1 bg-blue-50/50 border border-blue-100 p-6 rounded-xl'>
                            <p className='text-sm text-gray-500 mb-1'>Total Earnings</p>
                            <p className='text-3xl font-bold text-gray-800'>{currency}{userData.affiliateEarnings ? userData.affiliateEarnings.toFixed(2) : 0}</p>
                        </div>

                        <div className='flex-[2] bg-gray-50 border border-gray-100 p-6 rounded-xl'>
                            <p className='text-sm text-gray-500 mb-2'>Your Affiliate Link</p>
                            <div className='flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg'>
                                <input
                                    type="text"
                                    readOnly
                                    value={affiliateLink}
                                    className='flex-1 outline-none text-gray-600 text-sm'
                                />
                                <button
                                    onClick={() => { navigator.clipboard.writeText(affiliateLink); }}
                                    className='px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition'
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyAffiliate
