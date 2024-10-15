import { Flex, Box, Icon, Link } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const PageButtonList = ({
  onPaginationPrev,
  onPaginationNext,
  curPages,
  setCurPages,
  totalPages,
  onPaginationNumber,
}) => {
  return (
    <Flex
      as="nav"
      pb={4}
      align="center"
      justify="space-between"
      borderTop="1px"
      borderColor="gray.200"
      px={{ base: 4, sm: 0 }}
    >
      {/* 왼쪽 화살표 아이콘 */}
      <Icon
        as={ArrowBackIcon}
        mt={3}
        h={5}
        w={5}
        color="gray.400"
        cursor="pointer"
        aria-hidden="true"
        onClick={() => {
          setCurPages(0);
        }}
      />
      {/* 페이지 번호와 이전, 다음 링크 */}
      <Flex align="center">
        {/* 이전 버튼 */}
        <Link
          href="#"
          onClick={(e) => onPaginationPrev(e)}
          textDecoration="none"
          borderTop="2px solid transparent"
          pr={1}
          pt={4}
          fontSize="sm"
          fontWeight="medium"
          color="gray.500"
          _hover={{
            borderColor: "gray.300",
            color: "gray.700",
          }}
        >
          이전
        </Link>

        {/* 페이지 번호 */}
        <Flex>
          {[...Array(totalPages).keys()]
            .map((i) => i + 1)
            .slice(
              Math.floor(parseInt(curPages) / 10) * 10,
              Math.floor(parseInt(curPages) / 10) * 10 + 10
            )
            ?.map((idx) => (
              <Box
                key={idx}
                onClick={(e) => onPaginationNumber(e)}
                px={4}
                pt={4}
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                borderTop="2px solid"
                borderColor={idx === curPages + 1 ? "blue.500" : "transparent"}
                color={idx === curPages + 1 ? "#365ca5" : "gray.500"}
                _hover={{
                  borderColor: "gray.300",
                  color: "gray.700",
                }}
              >
                {idx}
              </Box>
            ))}
        </Flex>

        {/* 다음 버튼 */}
        <Link
          href="#"
          onClick={(e) => onPaginationNext(e)}
          textDecoration="none"
          borderTop="2px solid transparent"
          pl={1}
          pt={4}
          fontSize="sm"
          fontWeight="medium"
          color="gray.500"
          _hover={{
            borderColor: "gray.300",
            color: "gray.700",
          }}
        >
          다음
        </Link>
      </Flex>

      {/* 오른쪽 화살표 아이콘 */}
      <Icon
        as={ArrowForwardIcon}
        mt={3}
        h={5}
        w={5}
        color="gray.400"
        cursor="pointer"
        aria-hidden="true"
        onClick={() => {
          setCurPages(totalPages - 1);
        }}
      />
    </Flex>
  );
};

export default PageButtonList;
