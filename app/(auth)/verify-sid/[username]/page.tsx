'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { CldUploadButton } from 'next-cloudinary';
import { signOut } from 'next-auth/react';

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
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-sid/`, {
        username,
        image,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        await signOut();
        router.replace('/auth/sign-in');
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
    <>
      <div className="flex flex-col w-full h-screen items-center justify-center">
        <div className="flex flex-col w-2/5 h-4/5 justify-evenly items-center border-4 border-solid rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50 text-lg bg-gradient-to-br from-gray-200/60 to-gray-50/60">
          <div className="text-3xl font-bold">SID Verification</div>

          <div className="flex flex-col w-full h-3/5">
            <div className="flex flex-row justify-between items-center w-full h-1/4">
              <label htmlFor="image" className="ml-4 text-white font-bold">
                Upload Image:
              </label>
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET as string}
                onSuccess={handleImageUpload}
                className="w-1/3 ml-12 bg-white rounded-full"
              >
                Upload Image
              </CldUploadButton>
            </div>
            <div className="flex flex-col h-1/2 w-full">
              <div className="flex flex-row justify-between items-center w-full h-1/6">
                <label htmlFor="username" className="ml-4 text-white font-bold">
                  Username:
                </label>
                <input
                  type="text"
                  value={username || ''}
                  disabled
                  className="w-3/4 mr-4 pl-2"
                />
              </div>
              <div className="flex flex-row justify-between items-center w-full h-1/6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-center text-red-600">{message}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SIDVerificationPage;
