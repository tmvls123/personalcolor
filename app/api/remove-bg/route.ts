import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API 요청 시작');
    const formData = await request.formData();
    const imageFile = formData.get('image_file') as File;

    if (!imageFile) {
      console.error('이미지 파일이 없습니다.');
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('이미지 파일 크기:', imageFile.size);
    console.log('이미지 파일 타입:', imageFile.type);

    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      console.error('API 키가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    console.log('API 키 확인됨');

    const formDataToSend = new FormData();
    formDataToSend.append('image_file', imageFile);

    console.log('remove.bg API 호출 시작');
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('remove.bg API 오류:', error);
      throw new Error(error.message || '배경 제거 처리 중 오류가 발생했습니다.');
    }

    console.log('remove.bg API 응답 성공');
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-background.png"',
      },
    });
  } catch (error) {
    console.error('배경 제거 처리 중 오류:', error);
    return NextResponse.json(
      { error: '배경 제거 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 