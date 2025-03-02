'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [selectedSeason, setSelectedSeason] = useState<string>('spring');
  const [selectedColors, setSelectedColors] = useState<Array<{color: string, season: string}>>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<{color: string, name: string} | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  // 퍼스널 컬러 시스템 색상 옵션
  const colorOptions = {
    spring: [
      { name: '피치 코랄', color: '#FF8B83' },
      { name: '골드 옐로우', color: '#FFD700' },
      { name: '웜 핑크', color: '#FF91A4' },
      { name: '피치', color: '#FFCBA4' },
      { name: '아이보리', color: '#FFF8DC' },
      { name: '살몬 핑크', color: '#FF9999' },
      { name: '밝은 오렌지', color: '#FFA07A' },
      { name: '새싹 그린', color: '#90EE90' }
    ],
    summer: [
      { name: '라벤더', color: '#E6E6FA' },
      { name: '로즈 핑크', color: '#FFB6C1' },
      { name: '파우더 블루', color: '#B0E0E6' },
      { name: '그레이 퍼플', color: '#9896A4' },
      { name: '소프트 핑크', color: '#FFC0CB' },
      { name: '페일 민트', color: '#98FF98' },
      { name: '스카이 블루', color: '#87CEEB' },
      { name: '그레이시 로즈', color: '#D8A7B1' }
    ],
    autumn: [
      { name: '카멜 브라운', color: '#C19A6B' },
      { name: '머스타드', color: '#FFB81C' },
      { name: '올리브 그린', color: '#808000' },
      { name: '테라코타', color: '#E2725B' },
      { name: '카키', color: '#806B2A' },
      { name: '브릭 레드', color: '#8B4513' },
      { name: '다크 오렌지', color: '#FF8C00' },
      { name: '포레스트 그린', color: '#228B22' }
    ],
    winter: [
      { name: '퓨어 화이트', color: '#FFFFFF' },
      { name: '블랙', color: '#000000' },
      { name: '로얄 블루', color: '#4169E1' },
      { name: '버건디', color: '#800020' },
      { name: '플럼 퍼플', color: '#8B008B' },
      { name: '에메랄드', color: '#50C878' },
      { name: '퓨어 레드', color: '#FF0000' },
      { name: '아이스 블루', color: '#ADD8E6' }
    ]
  };

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

  // 선택된 색상의 계절 분석
  const analyzePersonalColor = () => {
    const seasonCount = selectedColors.reduce((acc, curr) => {
      acc[curr.season] = (acc[curr.season] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxCount = Math.max(...Object.values(seasonCount));
    const dominantSeason = Object.entries(seasonCount).find(([_, count]) => count === maxCount)?.[0];

    const seasonKorean = {
      spring: '봄 웜톤',
      summer: '여름 쿨톤',
      autumn: '가을 웜톤',
      winter: '겨울 쿨톤'
    };

    return dominantSeason ? `당신은 ${seasonKorean[dominantSeason as keyof typeof seasonKorean]}이군요!` : '';
  };

  // 색상 변경 처리
  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  // 색상 선택 처리 (라디오 버튼 클릭)
  const handleColorSelect = (color: string, index: number) => {
    const newColor = { color, season: selectedSeason };
    setSelectedColors([...selectedColors, newColor]);
    setSelectedImageIndex(index);
    
    // 분석 영역으로 스크롤
    if (analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 선택된 색상 제거
  const removeSelectedColor = (index: number) => {
    setSelectedColors(selectedColors.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SK HYNIX Personal Color</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-700 hover:text-gray-900">홈</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">포트폴리오</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">소개</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">문의</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <div className="relative bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              SK HYNIX PERSONAL COLOR ANALYSIS
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Can-mmeting 시간을 보내기 위하여<br />
              우리들의 재미를 위하여<br />
              당신의 이 시간에 만족을 드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* 이미지 처리 섹션 */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">퍼스널 컬러 진단</h2>
            <p className="mt-4 text-gray-600">
              본인의 얼굴 사진을 업로드하고 다양한 계절별 컬러를 적용해보세요
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg cursor-pointer
                  hover:bg-gray-50 transition-colors duration-200"
              >
                이미지 선택하기
              </label>
              
              {selectedImage && (
                <button
                  onClick={removeBackground}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
                >
                  {loading ? '처리중...' : '배경 제거하기'}
                </button>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectedImage && (
                <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900">원본 이미지</h3>
                  <div className="relative w-full aspect-square">
                    <Image
                      src={URL.createObjectURL(selectedImage)}
                      alt="Original"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {processedImage && (
                <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-lg shadow-lg col-span-2">
                  <h3 className="text-2xl font-semibold text-gray-900">퍼스널 컬러 시뮬레이션</h3>
                  
                  {/* 현재 선택된 시뮬레이션 */}
                  <div 
                    className="relative w-full max-w-2xl aspect-square rounded-lg overflow-hidden shadow-lg mx-auto"
                    style={{ backgroundColor }}
                  >
                    <Image
                      src={processedImage}
                      alt="Current Simulation"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* 계절 선택 탭 */}
                  <div className="w-full flex space-x-2">
                    {Object.keys(colorOptions).map((season) => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`flex-1 py-3 px-4 rounded-lg text-base font-medium transition-colors duration-200
                          ${selectedSeason === season 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {season === 'spring' && '봄 웜톤'}
                        {season === 'summer' && '여름 쿨톤'}
                        {season === 'autumn' && '가을 웜톤'}
                        {season === 'winter' && '겨울 쿨톤'}
                      </button>
                    ))}
                  </div>

                  {/* 색상 시뮬레이션 그리드 */}
                  <div className="w-full grid grid-cols-4 sm:grid-cols-8 gap-4">
                    {colorOptions[selectedSeason as keyof typeof colorOptions].map((option, index) => (
                      <div
                        key={option.color}
                        className="flex flex-col items-center"
                      >
                        <div className="relative w-full">
                          <div 
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all
                              ${selectedImageIndex === index ? 'ring-2 ring-blue-500' : 'hover:opacity-90'}`}
                            style={{ backgroundColor: option.color }}
                            onClick={() => handleColorChange(option.color)}
                          >
                            <Image
                              src={processedImage}
                              alt={option.name}
                              fill
                              className="object-contain"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleColorSelect(option.color, index);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 transition-all bg-white
                                hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              {selectedImageIndex === index && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </button>
                          </div>
                          <span className="text-sm mt-2 text-gray-600 block text-center">{option.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 커스텀 색상 선택 */}
                  <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="text-base font-medium text-gray-700">커스텀 색상:</label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 선택된 색상들의 시뮬레이션 결과 */}
            {selectedColors.length > 0 && processedImage && (
              <div ref={analysisRef} className="mt-12 bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">나의 퍼스널 컬러 분석</h3>
                  <p className="mt-2 text-gray-600">선택하신 색상들로 시뮬레이션한 결과입니다.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {selectedColors.map((selectedColor, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="relative aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: selectedColor.color }}
                      >
                        <Image
                          src={processedImage}
                          alt={`시뮬레이션 ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <button
                        onClick={() => removeSelectedColor(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* 퍼스널 컬러 분석 결과 */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    {analyzePersonalColor()}
                  </p>
                  <p className="text-gray-600">
                    선택하신 {selectedColors.length}개의 색상을 분석한 결과입니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">문의/소셜</h3>
              <ul className="space-y-2">
                <li>네이버 톡톡</li>
                <li>카카오톡 채널</li>
                <li>블로그</li>
                <li>Instagram</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li>Personal Color</li>
                <li>이미지 컨설팅</li>
                <li>메이크업</li>
                <li>전문가 양성</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">회사 정보</h3>
              <p className="text-gray-400">
                Personal Color Analysis & Training<br />
                전문 기업
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
