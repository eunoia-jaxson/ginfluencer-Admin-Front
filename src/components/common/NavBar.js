import { Button, Link, Box, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ADMIN_NAVIGATE_LIST, POST_CATEGORY } from "../../constants/admin";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const isActive = (path, query) =>
    location.pathname.includes(path) && location.search.includes(query);

  return (
    <Box
      id="nav-bar"
      p={4}
      display={{ base: "none", md: "block" }}
      w={{ sm: "48" }}
      minH="100vh"
      bgColor={"gray.100"}
    >
      <Box p={2}>
        <Link as={RouterLink} to="/storeList">
          <Button
            variant="link"
            fontWeight="semibold"
            color={isActive("storeList", "") ? "#365ca5" : "inherit"}
            whiteSpace="nowrap"
            _hover={{ textDecoration: "none" }}
          >
            선한영향력가게 관리
          </Button>
        </Link>
      </Box>

      <Box p={2}>
        <Link as={RouterLink} to="/noticeList">
          <Button
            variant="link"
            mt={2}
            mb={1}
            fontWeight="semibold"
            color={isActive("noticeList", "") ? "#365ca5" : "inherit"}
            _hover={{ textDecoration: "none" }}
          >
            커뮤니티 관리
          </Button>
        </Link>
        {ADMIN_NAVIGATE_LIST.map(({ title, url }) => (
          <Link
            as={RouterLink}
            to={url}
            key={url}
            _hover={{ textDecoration: "none" }}
          >
            <Text
              ml={2}
              mt={1}
              mb={1}
              pl={2}
              fontSize="sm"
              cursor="pointer"
              color={isActive(url, "") ? "#365ca5" : "gray.500"}
              fontWeight={isActive(url, "") ? "semibold" : "normal"}
            >
              - {title}
            </Text>
          </Link>
        ))}
      </Box>

      <Box p={2}>
        <Link as={RouterLink} to="/post?type=popup">
          <Button
            variant="link"
            mt={2}
            mb={1}
            fontWeight="semibold"
            color={isActive("post", "") ? "#365ca5" : "inherit"}
            _hover={{ textDecoration: "none" }}
          >
            홈페이지 관리
          </Button>
        </Link>
        {POST_CATEGORY.map(({ title, url }) => {
          const query = new URLSearchParams(url.split("?")[1]).get("type");
          return (
            <Link
              as={RouterLink}
              to={url}
              key={url}
              _hover={{ textDecoration: "none" }}
            >
              <Text
                ml={2}
                mt={2}
                fontSize="sm"
                cursor="pointer"
                color={
                  isActive("post", `type=${query}`) ? "#365ca5" : "gray.500"
                }
                fontWeight={
                  isActive("post", `type=${query}`) ? "semibold" : "normal"
                }
              >
                - {title}
              </Text>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
};

export default NavBar;
