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
          px={6}
          py={2}
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
