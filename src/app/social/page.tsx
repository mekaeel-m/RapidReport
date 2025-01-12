"use client"
import { useState } from "react";

export default function SocialView() {
  const imageUrls = Array.from({ length: 16 }, (_, index) => `https://picsum.photos/300/200?random=${index}`);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Social View</h1>
      <div className="grid grid-cols-3 gap-8">
        {imageUrls.map((image, index) => (
          <Card key={index} image={image} />
        ))}
      </div>
    </div>
  );
}

function Card({ image }: any) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(true);
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 rounded mb-4 overflow-hidden">
        <img
          src={image}
          alt="Card Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Like button */}
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded ${
          liked ? "bg-pink-500 text-white" : "bg-blue-500 text-white"
        } hover:bg-pink-600`}
        disabled={liked}
      >
        {liked ? "Liked!" : "Like"}
      </button>
    </div>
  );
}
