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
    const dominantSeason = Object.entries(seasonCount).find(([, count]) => count === maxCount)?.[0];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 네비게이션 바 */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">PERSONAL COLOR</span>
                <span className="text-sm text-gray-600">AI 컬러 분석 시스템</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium">홈</a>
              <a href="#color-diagnosis" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium">퍼스널 컬러 진단</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium">문의</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <div className="relative bg-gradient-to-r from-blue-50 via-white to-purple-50 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              SK HYNIX PERSONAL COLOR
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-600 font-light max-w-3xl mx-auto">
              당신만의 특별한 컬러를 찾아드립니다.<br />
              SK하이닉스의 Can Meeting 을 위해 만들어진 APP
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="#color-diagnosis" className="rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200">
                시작하기
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 처리 섹션 */}
      <div id="color-diagnosis" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              퍼스널 컬러 진단
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              AI 기술로 분석하는 당신만의 완벽한 컬러 매칭
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col items-center gap-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="group relative px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl cursor-pointer
                  hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 flex items-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 group-hover:text-blue-600 font-medium">이미지 선택하기</span>
              </label>
              
              {selectedImage && (
                <button
                  onClick={removeBackground}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl
                    hover:from-blue-500 hover:to-purple-500 disabled:from-gray-400 disabled:to-gray-400 
                    transition-all duration-200 font-medium shadow-lg shadow-blue-500/20
                    disabled:shadow-none flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>처리중...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>배경 제거하기</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {selectedImage && (
                <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-semibold text-gray-900">원본 이미지</h3>
                  <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden">
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
                <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 col-span-2">
                  <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    퍼스널 컬러 시뮬레이션
                  </h3>
                  
                  {/* 현재 선택된 시뮬레이션 */}
                  <div 
                    className="relative w-full max-w-2xl aspect-square rounded-xl overflow-hidden shadow-lg mx-auto transition-all duration-300"
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
                  <div className="w-full flex space-x-3">
                    {Object.keys(colorOptions).map((season) => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`flex-1 py-3 px-4 rounded-xl text-base font-medium transition-all duration-200
                          ${selectedSeason === season 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
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
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="relative w-full group">
                          <div 
                            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200
                              ${selectedImageIndex === index 
                                ? 'ring-4 ring-blue-500 ring-offset-2' 
                                : 'hover:scale-105 hover:shadow-lg'}`}
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
                              className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 transition-all
                                ${selectedImageIndex === index
                                  ? 'bg-blue-500 border-white'
                                  : 'bg-white border-gray-300 hover:border-blue-500'}`}
                            >
                              {selectedImageIndex === index && (
                                <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </button>
                          </div>
                          <span className="text-sm text-gray-600 text-center block mt-2 font-medium">{option.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 커스텀 색상 선택 */}
                  <div className="w-full flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                    <label className="text-base font-medium text-gray-700">커스텀 색상:</label>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 선택된 색상들의 시뮬레이션 결과 */}
            {selectedColors.length > 0 && processedImage && (
              <div ref={analysisRef} className="mt-16 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50">
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    나의 퍼스널 컬러 분석
                  </h3>
                  <p className="mt-2 text-gray-600">선택하신 색상들로 시뮬레이션한 결과입니다.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {selectedColors.map((selectedColor, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="relative aspect-square rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-200"
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
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* 퍼스널 컬러 분석 결과 */}
                <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {analyzePersonalColor()}
                  </p>
                  <p className="text-lg text-gray-600">
                    선택하신 {selectedColors.length}개의 색상을 분석한 결과입니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 문의하기 섹션 */}
      <div id="contact" className="py-24 bg-gradient-to-r from-blue-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              문의하기
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              퍼스널 컬러에 대해 궁금하신 점이 있으시다면 언제든 문의해주세요.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 text-lg text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:tmvls123@naver.com" className="hover:text-blue-600 transition-colors duration-200">
                  tmvls123@naver.com
                </a>
              </div>
              <p className="mt-4 text-gray-500">
                이메일로 문의해 주시면 빠른 시일 내에 답변 드리도록 하겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">PERSONAL COLOR</span>
                  <span className="text-sm text-gray-400">AI 컬러 분석 시스템</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                당신만의 특별한 컬러를<br />
                찾아드립니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">문의하기</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:tmvls123@naver.com">tmvls123@naver.com</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">서비스</h3>
              <ul className="space-y-4">
                <li className="text-gray-400 hover:text-white transition-colors">
                  <a href="#">Personal Color</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">회사 정보</h3>
              <p className="text-gray-400">
                현섭컴퍼니<br />
                Personal Color Analysis
              </p>
              <div className="mt-6">
                <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                  문의하기
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2024 SK HYNIX Personal Color. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
