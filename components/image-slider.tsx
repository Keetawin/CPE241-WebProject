import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import mockData from "../pages/api/mock_event.json";

const ShuttersSlider = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  useEffect(() => {
    const images = mockData.map((data) => data.poster);
    setImageUrls(images);
    setCurrentImageUrl(images[Math.floor(Math.random() * images.length)]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomImageUrl =
        imageUrls[Math.floor(Math.random() * imageUrls.length)];
      setCurrentImageUrl(randomImageUrl);
    }, 30000);
    return () => clearInterval(interval);
  }, [imageUrls]);

  return (
    <div className="relative w-full py-6">
      <Link href="/event-detail">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${currentImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-white mb-10">
                {
                  mockData.find((data) => data.poster === currentImageUrl)
                    ?.event_name
                }
              </h1>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShuttersSlider;
