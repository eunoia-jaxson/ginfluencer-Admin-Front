import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Checkbox,
  Input,
  Textarea,
  Spinner,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import AdminTitle from "../../components/common/AdminTitle";
import { useNavigate, useLocation } from "react-router-dom";
import RatioSimpleInlineList2 from "../../components/common/RatioSimpleInlineList2";
import { VIEW_TYPE } from "../../constants/admin";
import { makeClearValue } from "../../utils/safe";
import HoverButton from "../../components/common/HoverButton";

const DonationForm = ({ data = {}, onSubmit }) => {
  const { donations, donors, expenses } = data;
  const [donation, setDonation] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    const clearValue = makeClearValue(value);
    setDonation({ ...donation, [name]: clearValue });
  };
  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <AdminTitle hasAddButton={null} title="기부금 설정" />

      <Box
        as="form"
        p="8"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        maxW="2xl"
        mx="auto"
        bg="white"
      >
        <Table width="100%">
          <Tbody>
            <Tr>
              <Th>총 기부금</Th>
              <Td>
                <NumberInput
                  name="donations"
                  value={data.donations}
                  onChange={(valueString) => {
                    onChange({
                      target: {
                        name: "donations",
                        value: valueString,
                      },
                    });
                  }}
                  min={0}
                  max={100}
                  borderColor="gray.300"
                  focusBorderColor="blue.300"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
            </Tr>
            <Tr>
              <Th>총 기부자 수</Th>
              <Td>
                <NumberInput
                  name="donors"
                  value={data.donors}
                  onChange={(valueString) => {
                    onChange({
                      target: {
                        name: "donors",
                        value: valueString,
                      },
                    });
                  }}
                  min={0}
                  max={100}
                  borderColor="gray.300"
                  focusBorderColor="blue.300"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
            </Tr>
            <Tr>
              <Th>총 지출</Th>
              <Td>
                <NumberInput
                  name="expenses"
                  value={data.expenses}
                  onChange={(valueString) => {
                    onChange({
                      target: {
                        name: "expenses",
                        value: valueString,
                      },
                    });
                  }}
                  min={0}
                  max={100}
                  borderColor="gray.300"
                  focusBorderColor="blue.300"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Button
          type="submit"
          colorScheme="blue"
          w="full"
          mt="4"
          isLoading={false}
        >
          저장하기
        </Button>
      </Box>
    </Box>
  );
};

export default DonationForm;
