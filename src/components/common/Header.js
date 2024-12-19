import { Image, Flex, Link, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import footerLogo from '../../assets/images/footer_logo.png';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('refreshToken');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Flex
      id="admin-header"
      align="center"
      justify="space-between"
      bg="main" // main 색상이 테마에 정의되어 있는 경우
      color="white"
      h="16" // Tailwind의 h-16을 Chakra UI의 h로 변환
      px={8}
      py={4}
    >
      <Link href="/storeList">
        <Image
          src={footerLogo} // 이미지 경로 설정
          alt="Footer Logo" // 대체 텍스트 설정
          w="24" // 너비 설정
          h="12" // 높이 설정
          objectFit="cover" // 이미지 크기 맞추기 (bgSize="cover"와 동일)
          cursor="pointer" // 포인터 스타일 설정 (클릭 가능하게)
        />
      </Link>
      <Flex align="center">
        <Button
          onClick={handleLogout}
          ml={4}
          variant="ghost" // 기본 버튼 스타일 대신 "ghost" 스타일을 사용하여 텍스트만 보이게
          color="white"
          _hover={{ textDecoration: 'none' }}
        >
          로그아웃
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
