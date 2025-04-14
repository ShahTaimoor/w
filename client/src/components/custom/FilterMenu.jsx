import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { setProducts } from '@/redux/slices/productSlice';
import { useDispatch } from 'react-redux';

const FilterMenu = () => {
    const dispatch = useDispatch();

    const categoryData = {
        items: ["All", "Perfume & Fragrances", "Stickers Emblems Key Chains", "Interior", "Exterior", "Security Badges", "Lightening"],
        images: [
            "https://gulautos.pk/wp-content/uploads/2025/02/Modification.png",
            "https://gulautos.pk/wp-content/uploads/2021/10/key-chain-main-1.jpg",
            "https://gulautos.pk/wp-content/uploads/2021/10/Interior.jpg",
            "https://gulautos.pk/wp-content/uploads/2021/10/exterior.jpg",
            "https://gulautos.pk/wp-content/uploads/2021/10/perfomance-parts.jpg",
            "https://gulautos.pk/wp-content/uploads/2021/09/utilities-50x55.png",
            "https://gulautos.pk/wp-content/uploads/2021/10/Security-Gadgets.jpg"
        ]
    };

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All");


    useEffect(() => {
        const getFilterProducts = async () => {

            try {
                const categoryParam = selectedCategory === 'All' ? 'all' : selectedCategory;
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/get-products?category=${categoryParam}&search=${search}`
                );
                dispatch(setProducts(res.data.data));
            } catch (error) {
                console.error("Failed to fetch filtered products", error);
            }
        };

        const debounceTimer = setTimeout(() => {
            getFilterProducts();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [selectedCategory, search, dispatch]);

    return (
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
                <div className="flex space-x-6 pb-2">
                    {categoryData.items.map((category, index) => (
                        <div
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`flex mt-2 flex-col items-center min-w-[120px] cursor-pointer transition-all duration-200 ${selectedCategory === category ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                        >
                            {/* Image Container */}
                            <div className={`relative w-20 h-20 mb-2 rounded-full p-1 ${selectedCategory === category ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'}`}>
                                <img
                                    className="w-full h-full object-contain rounded-full"
                                    src={categoryData.images[index]}
                                    alt={category}

                                />
                                {selectedCategory === category && (
                                    <div className="absolute inset-0 rounded-full bg-blue-500/10"></div>
                                )}
                            </div>

                            {/* Category Name */}
                            <span className={`text-sm font-medium text-center ${selectedCategory === category ? 'text-blue-600' : 'text-gray-700'}`}>
                                {category}
                            </span>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default FilterMenu;