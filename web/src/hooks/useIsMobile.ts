import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 예시: 768px 미만을 모바일로 간주
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 로드 시 한 번 실행

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
