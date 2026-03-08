import React, { useState, useEffect } from 'react';

interface BackgroundSlideshowProps {
    images: string[];
    interval?: number;
    children?: React.ReactNode;
}

export const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({
    images,
    interval = 5000,
    children
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        // Preload all images
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, [images]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Images Container */}
            <div className="absolute inset-0">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                        style={{
                            backgroundImage: `url(${image})`,
                            opacity: index === activeIndex ? 1 : 0,
                            zIndex: index === activeIndex ? 1 : 0,
                        }}
                    />
                ))}

                {/* Dark overlay for better form visibility */}
                <div className="absolute inset-0 bg-black bg-opacity-40" style={{ zIndex: 2 }} />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
};