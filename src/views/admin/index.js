import {
  Box,
  Flex,
  Input,
  Button,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headerLogo from '../../assets/images/header_logo.png';

const Admin = () => {
  const padding = useBreakpointValue({ base: 8, md: 12 });
  const logoWidth = useBreakpointValue({ base: '12rem', md: '16rem' });
  const logoHeight = useBreakpointValue({ base: '6rem', md: '8rem' });

  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: '',
    passwd: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.passwd) {
      alert('빈칸 없이 입력해주세요.');
      return;
    }

    try {
      if (form.userId === 'admin' && form.passwd === '1234') {
        navigate('/storeList');
      } else {
        alert('아이디 혹은 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <Flex justify="center" align="center" minH="100vh" p={4}>
      <Box
        bg="gray.100"
        p={padding}
        w="full"
        maxW="md"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          bgImage={`url(${headerLogo})`}
          bgSize="cover"
          w={logoWidth}
          h={logoHeight}
          mb={4}
        />
        <Heading size={useBreakpointValue({ base: 'md', md: 'lg' })} pb={4}>
          New 관리자 페이지
        </Heading>
        <Flex
          as="form"
          flexDirection="column"
          justify="center"
          align="center"
          w="full"
        >
          <Flex flexDirection="column" m={4} w="full" gap={2}>
            <Input
              name="userId"
              type="text"
              placeholder="아이디"
              onChange={handleChange}
              size={useBreakpointValue({ base: 'sm', md: 'md' })}
              bgColor="white"
            />
            <Input
              name="passwd"
              type="password"
              placeholder="패스워드"
              onChange={handleChange}
              size={useBreakpointValue({ base: 'sm', md: 'md' })}
              bgColor="white"
            />
          </Flex>
          <Button
            w="full"
            py={useBreakpointValue({ base: 6, md: 8 })}
            bg="main"
            color="white"
            rounded="none"
            onClick={handleLogin}
            _hover={{ textDecoration: 'none' }}
          >
            로그인
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Admin;
