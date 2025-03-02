'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setProcessedImage(null);
      setError(null);
    }
  };

  const removeBackground = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image_file', selectedImage);

    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('배경 제거 처리 중 오류가 발생했습니다.');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">이미지 배경 제거 서비스</h1>
        
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full max-w-md text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            
            {selectedImage && (
              <button
                onClick={removeBackground}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg
                  hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? '처리중...' : '배경 제거하기'}
              </button>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedImage && (
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-xl font-semibold">원본 이미지</h2>
                <div className="relative w-full aspect-square">
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    alt="Original"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {processedImage && (
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-xl font-semibold">결과 이미지</h2>
                <div className="relative w-full aspect-square">
                  <Image
                    src={processedImage}
                    alt="Processed"
                    fill
                    className="object-contain"
                  />
                </div>
                <a
                  href={processedImage}
                  download="removed-background.png"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg
                    hover:bg-green-600"
                >
                  다운로드
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
