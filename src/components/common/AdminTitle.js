import { Flex, Heading, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ title, hasAddButton, form }) => {
  const navigate = useNavigate();

  return (
    <Flex justify="space-between" align="center" pb={4}>
      <Heading as="h2" size="xl" fontWeight="semibold" p={2}>
        {title}
      </Heading>
      {hasAddButton && (
        <Button
          px={6} // Tailwind의 px-6를 Chakra UI의 padding 속성으로 대체
          py={2} // Tailwind의 py-2를 Chakra UI의 padding 속성으로 대체
          onClick={() => navigate(form)}
          bg="main"
          color="white"
          _hover={{ textDecoration: "none" }}
        >
          추가
        </Button>
      )}
    </Flex>
  );
};

export default AdminHeader;
