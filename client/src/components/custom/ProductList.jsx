import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useSelector } from 'react-redux';
import { Skeleton } from '@/components/ui/skeleton'; 

const ProductList = () => {
    const { products, isLoading } = useSelector((state) => state.products); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (products?.length > 0) {
            setLoading(false);
        }
    }, [products]);

    return (
        <div className='w-[90vw] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mx-auto gap-5 place-content-center my-10'>
            {loading ? (
                // Skeleton loader for the grid
                Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="w-full h-full">
                        <Skeleton className="h-[300px] w-full rounded-xl" /> {/* Skeleton for ProductCard */}
                    </div>
                ))
            ) : (
                products?.map((product) => (
                    <ProductCard
                        key={product._id}
                        _id={product?._id}
                        name={product?.name}
                        price={product?.price}
                        stock={product?.stock}
                        image={product?.image}
                    />
                ))
            )}
        </div>
    );
};

export default ProductList;
