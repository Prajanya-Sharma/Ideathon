'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { CldUploadButton } from 'next-cloudinary';
import { signOut } from 'next-auth/react';
import { Upload, User, Lock, Check } from 'lucide-react';

const SIDVerificationPage = () => {
  const { username } = useParams();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (result: any) => {
    if (result.event === 'success') {
      setImage(result.info.secure_url);
    }
  };

  const handleSubmit = async () => {
    if (!username || !image) {
      setMessage('User ID or Image is missing.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-sid/`, {
        username,
        image,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        await signOut();
        router.replace('/dashboard/student');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setMessage('Error verifying user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-lg">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-500 mb-2">
              SID Verification
            </h1>
            <Lock className="mx-auto w-12 h-12 text-gray-600" />
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-2">
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
                onSuccess={handleImageUpload}
                className="w-full py-4 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white flex items-center justify-center gap-3"
              >
                <Upload className="w-6 h-6" />
                <span className="font-semibold">Upload Image</span>
              </CldUploadButton>
              
              {image && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <Check className="w-5 h-5" />
                  <span>Image successfully uploaded</span>
                </div>
              )}
            </div>

            {/* Username Field */}
            <div className="relative">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <User className="w-6 h-6 text-gray-600" />
                <input
                  type="text"
                  value={username || ''}
                  disabled
                  className="w-full bg-transparent border-none text-gray-700 focus:ring-0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-semibold text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Identity'
              )}
            </button>
          </div>

          {/* Error Message */}
          {message && (
            <div className="text-center p-4 rounded-lg bg-red-50 text-red-600">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SIDVerificationPage;