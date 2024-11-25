import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
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
import axios from "axios";

let idCounter = 1;

const DonationForm = ({ onSubmit }) => {
  const [donation, setDonation] = useState({
    id: idCounter++,
    totalDonation: 0,
    totalCount: 0,
    totalSpend: 0,
  });

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/all/donations`
        );
        const data = response.data;
        setDonation({
          id: data.id || idCounter++,
          totalDonation: data.totalDonation || 0,
          totalCount: data.totalCount || 0,
          totalSpend: data.totalSpend || 0,
        });
      } catch (error) {
        console.error("기부금 정보를 가져오는 데 실패했습니다:", error);
        alert("기부금 정보를 가져오는 데 실패했습니다.");
      }
    };

    fetchDonationData();
  }, []);

  const handleInputChange = (name, value) => {
    setDonation((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("저장된 기부금 정보:", donation);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/admin/donations`,
        donation
      );
      setDonation((prev) => ({ ...prev, id: response.data.id }));

      alert("기부금 정보가 저장되었습니다.");
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error(error);
      alert("기부금 정보 저장에 실패했습니다.");
    }
  };

  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <AdminTitle hasAddButton={null} title="기부금 설정" />

      <Box
        as="form"
        onSubmit={handleSubmit}
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
                  value={donation.totalDonation}
                  onChange={(valueString) =>
                    handleInputChange("totalDonation", valueString)
                  }
                  min={0}
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
                  value={donation.totalCount}
                  onChange={(valueString) =>
                    handleInputChange("totalCount", valueString)
                  }
                  min={0}
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
                  value={donation.totalSpend}
                  onChange={(valueString) =>
                    handleInputChange("totalSpend", valueString)
                  }
                  min={0}
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
