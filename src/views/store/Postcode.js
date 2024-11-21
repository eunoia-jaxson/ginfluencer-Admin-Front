import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function Postcode({ setStoreAddress }) {
  const [isOpen, setIsOpen] = useState(false); // 팝업 열림 상태

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    let localAddress = data.sido + " " + data.sigungu;

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress = fullAddress.replace(localAddress, "");
      fullAddress += extraAddress !== "" ? `(${extraAddress})` : "";
    }

    // 부모 상태 업데이트
    setStoreAddress(localAddress + " " + fullAddress);

    // 팝업 닫기
    setIsOpen(false);
  };

  const openPopup = () => setIsOpen(true); // 팝업 열기
  const closePopup = () => setIsOpen(false); // 팝업 닫기

  return (
    <>
      <Button onClick={openPopup} colorScheme="blue" mt={4}>
        주소 검색
      </Button>

      <Modal isOpen={isOpen} onClose={closePopup} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>주소 검색하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DaumPostcode onComplete={handleComplete} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Postcode;
