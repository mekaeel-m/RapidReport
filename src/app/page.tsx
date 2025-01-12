"use client";

import { processSubmission } from "@/services/newProcessSubmission";
import { useState, useEffect } from "react";

export default function Home() {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [problem, setProblem] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setError(null);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permission to access location was denied.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Position unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!problem || !latitude || !longitude) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await processSubmission({
        problem,
        latitude,
        longitude,
      });

      console.log("Generated Email:", response);
      alert(`Email Subject: ${response.subject}\nEmail Body: ${response.body}`);
    } catch (error) {
      setError("There was an error submitting your report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 max-w-5xl">
        {/* Left Column */}
        <div className="lg:w-2/3 text-center lg:text-left">
          <h1 className="text-5xl font-bold mb-4">Rapid Report</h1>
          <p className="text-xl text-gray-300 mb-6">
            Something Broken? Report it.
            <br />
            Accessibility reports made easy.
          </p>

          {/* Problem Text Area */}
          <textarea
            placeholder="Describe the problem..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full max-w-md p-3 border border-gray-600 rounded-md bg-slate-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={loading}
          />

          {/* Latitude and Longitude Fields */}
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="latitude" className="block text-sm text-gray-400">
                Latitude:
              </label>
              <input
                id="latitude"
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Enter Latitude"
                className="w-full max-w-md p-3 border border-gray-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm text-gray-400">
                Longitude:
              </label>
              <input
                id="longitude"
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Enter Longitude"
                className="w-full max-w-md p-3 border border-gray-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-400 mt-2">
                {error} (You can enter the latitude and longitude manually)
              </p>
            )}
          </div>
        </div>

        <div className="lg:w-1/3 flex flex-col items-center space-y-4 mt-8 lg:mt-0">
          {/* Image Preview */}
          {image ? (
            <img
              src={image}
              alt="Uploaded preview"
              className="w-64 h-auto border-4 border-white rounded-lg shadow-md"
            />
          ) : (
            <div className="w-64 h-48 flex items-center justify-center border-4 border-dashed border-gray-500 rounded-lg text-gray-400">
              No image uploaded
            </div>
          )}

          {/* Upload Button */}
          <label
            htmlFor="imageUpload"
            className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Upload Image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={loading}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
