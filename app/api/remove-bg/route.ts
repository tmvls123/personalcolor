import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image_file') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const formDataToSend = new FormData();
    formDataToSend.append('image_file', imageFile);

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '배경 제거 처리 중 오류가 발생했습니다.');
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-background.png"',
      },
    });
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json(
      { error: '배경 제거 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 