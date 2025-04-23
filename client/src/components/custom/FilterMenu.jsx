import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { setProducts } from '@/redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';

const FilterMenu = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const categoryData = {
        items: [
            "All",
            "Stickers Emblems Key Chains",
            "Interior",
            "Exterior",
            "Security Badges",
            "Lightening",
            "Lightening",
            "Lightening",
            "Lightening",
        ],
        images: [
            "https://gulautos.pk/wp-content/uploads/2025/02/Modification.png",
            "https://gulautos.pk/wp-content/uploads/2021/10/key-chain-main-1.jpg",
            "https://gulautos.pk/wp-content/uploads/2021/10/Interior.jpg",
            "https://gulautos.pk/wp-content/uploads/2021/10/exterior.jpg",
            "https://gulautos.pk/wp-content/uploads/2021/09/utilities-50x55.png",
            "https://gulautos.pk/wp-content/uploads/2021/09/utilities-50x55.png",
            "https://gulautos.pk/wp-content/uploads/2021/09/utilities-50x55.png",
            "https://gulautos.pk/wp-content/uploads/2021/09/utilities-50x55.png",
            "https://gulautos.pk/wp-content/uploads/2021/09/utilities-50x55.png",
            "https://gulautos.pk/wp-content/uploads/2021/10/Security-Gadgets.jpg"
        ]
    };

    // Utility function to chunk categories
    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    useEffect(() => {
        const getFilterProducts = async () => {
            try {
                setLoading(true);
                setErrorMessage('');
                const categoryParam = selectedCategory === 'All' ? 'all' : selectedCategory;
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/get-products?category=${categoryParam}&search=${search}`
                );

                if (res.data.data.length === 0) {
                    setErrorMessage('Category not found');
                } else {
                    dispatch(setProducts(res.data.data));
                }
            } catch (error) {
                console.error("Failed to fetch filtered products", error);
                setErrorMessage('Product Not Found');
                dispatch(setProducts([]));
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            getFilterProducts();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [selectedCategory, search, dispatch]);

    return (
        <>
            <div className="sticky top-0 z-10 bg-white shadow-sm pb-4">
                {/* Search Bar */}
                <div className="px-6 py-4">
                    <div className="relative max-w-2xl mx-auto">
                        <Input
                            className="w-full pl-10 pr-4 py-3 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            id='search'
                            placeholder='Search products...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="px-4 overflow-x-auto">
                    <Swiper
                        spaceBetween={10}
                        slidesPerView="auto"
                        loop={true}
                        grabCursor={true}
                        className="pb-2 mySwiper"
                        pagination={true} modules={[Pagination]}
                    >
                        {chunkArray(categoryData.items, 8).map((chunk, chunkIndex) => (
                            <SwiperSlide key={chunkIndex}>
                                <div className="grid grid-cols-4 mt-5 pb-8 sm:grid-cols-8 gap-4 justify-items-center">
                                    {chunk.map((category, i) => {
                                        const globalIndex = chunkIndex * 8 + i;
                                        return (
                                            <div
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className="flex flex-col items-center cursor-pointer"
                                            >
                                                <div
                                                    className={`relative w-16 h-16 rounded-full p-1 ${selectedCategory === category ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300'}`}
                                                >
                                                    <img
                                                        src={categoryData.images[globalIndex]}
                                                        alt={category}
                                                        title={category}
                                                        className="w-full h-full object-contain rounded-full"
                                                        onError={(e) => e.target.src = '/fallback.png'} // Optional fallback
                                                    />
                                                    {selectedCategory === category && (
                                                        <div className="absolute inset-0 rounded-full bg-blue-500/10"></div>
                                                    )}
                                                </div>
                                                <span className={`text-xs text-center mt-1 ${selectedCategory === category ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                                    {category}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
                <div className="flex justify-center mt-28 items-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-blue-600">Loading products...</span>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="text-center mt-8 text-gray-500">
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* No Products Message */}
            {!loading && !errorMessage && products.length === 0 && selectedCategory !== "All" && (
                <div className="text-center mt-8 text-gray-600">
                    <span>No products available in this category.</span>
                </div>
            )}
        </>
    );
};

export default FilterMenu;
