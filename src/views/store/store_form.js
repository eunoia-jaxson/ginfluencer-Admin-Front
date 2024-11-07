import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Box,
  useToast,
  Select,
  Checkbox,
  HStack,
  Switch,
  RadioGroup,
  Radio,
  Heading,
  Divider,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";

const StoreForm = ({ fetchAllStores }) => {
  const [level, setLevel] = useState("ASSOCIATE_MEMBER");
  const [businessNumber, setBusinessNumber] = useState("");
  const [enrollDate, setEnrollDate] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storeTitle, setStoreTitle] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [subBusinessType, setSubBusinessType] = useState("");
  const [storePhoneNumber, setStorePhoneNumber] = useState("");
  const [seeAvailable, setSeeAvailable] = useState(true);
  const [storeAddress, setStoreAddress] = useState("");
  const [storeDetailAddress, setStoreDetailAddress] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [openBreakTime, setOpenBreakTime] = useState("");
  const [closeBreakTime, setCloseBreakTime] = useState("");
  const [restDays, setRestDays] = useState([]);
  const [depositCheck, setDepositCheck] = useState(false);
  const [provideItems, setProvideItems] = useState([
    {
      name: "",
      existingPrice: "",
      providePrice: "",
      freeProvide: false,
    },
  ]);
  const [provideTarget1, setProvideTarget1] = useState("CHILD_ONLY");
  const [provideTarget2, setProvideTarget2] = useState("");
  const [snsType1, setSnsType1] = useState("");
  const [snsName1, setSnsName1] = useState("");
  const [snsType2, setSnsType2] = useState("");
  const [snsName2, setSnsName2] = useState("");
  const [storeImgCI, setStoreImgCI] = useState("");
  const [storeImgFront, setStoreImgFront] = useState("");
  const [storeImgInside, setStoreImgInside] = useState("");
  const [storeImgMenupan, setStoreImgMenupan] = useState("");
  const [storeImgMenu, setStoreImgMenu] = useState("");

  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleProvideItemChange = (index, field, value) => {
    const updatedItems = [...provideItems];
    updatedItems[index][field] = value;
    if (field === "freeProvide" && value === true) {
      updatedItems[index].providePrice = 0;
    }
    setProvideItems(updatedItems);
  };

  const handleAddProvideItem = () => {
    setProvideItems([
      ...provideItems,
      { name: "", existingPrice: "", providePrice: "", freeProvide: false },
    ]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!businessNumber)
      newErrors.businessNumber = "사업자번호를 입력해주세요.";
    const enrollDate = /^\d{4}-\d{2}-\d{2}$/;
    if (!enrollDate) newErrors.enrollDate = "가입 연월일을 입력해주세요.";
    if (!representativeName) {
      newErrors.representativeName = "대표자 성명을 입력해주세요.";
    } else if (
      representativeName.length < 2 ||
      representativeName.length > 15
    ) {
      newErrors.representativeName = "이름은 2~15자 이내로 입력해주세요.";
    }
    if (!ceoName || ceoName.length < 2 || ceoName.length > 15)
      newErrors.ceoName = "이름은 2~15자 이내로 입력해주세요.";
    if (
      !storeEmail ||
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(storeEmail)
    )
      newErrors.storeEmail = "올바른 이메일 형식으로 입력해주세요.";
    if (!phoneNumber || !/^\d{3}-\d{3,4}-\d{4}$/.test(phoneNumber))
      newErrors.phoneNumber = "유효한 휴대폰 번호를 입력해주세요.";
    if (
      !password ||
      !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,16}$/.test(
        password
      )
    )
      newErrors.password = "입력 양식이 맞지 않습니다.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!storeTitle) newErrors.storeTitle = "상호명을 입력해주세요.";
    if (!storePhoneNumber || !/^\d{3}-\d{3,4}-\d{4}$/.test(storePhoneNumber))
      newErrors.storePhoneNumber = "유효한 매장번호를 입력해주세요.";
    provideItems.forEach((item, index) => {
      if (isNaN(item.existingPrice) || isNaN(item.providePrice)) {
        newErrors[`provideItem${index}`] = "숫자만 입력 가능합니다.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const storeData = {
      level,
      businessNumber,
      ceoName,
      storeEmail,
      phoneNumber,
      password,
      confirmPassword,
      storeTitle,
      businessType,
      subBusinessType,
      storePhoneNumber,
      seeAvailable,
      storeAddress,
      storeDetailAddress,
      openTime,
      closeTime,
      openBreakTime,
      closeBreakTime,
      restDays,
      depositCheck,
      provideItems,
      provideTarget1,
      provideTarget2,
      snsType1,
      snsName1,
      snsType2,
      snsName2,
      storeImgCI,
      storeImgFront,
      storeImgInside,
      storeImgMenupan,
      storeImgMenu,
    };

    try {
      await axiosInstance.post("/api/admin/stores/create", storeData);
      fetchAllStores(); // Refresh store list
      toast({
        title: "Store added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form fields
      setLevel("ASSOCIATE_MEMBER");
      setBusinessNumber("");
      setCeoName("");
      setStoreEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      setStoreTitle("");
      setBusinessType("");
      setSubBusinessType("");
      setStorePhoneNumber("");
      setSeeAvailable(true);
      setStoreAddress("");
      setStoreDetailAddress("");
      setOpenTime("");
      setCloseTime("");
      setOpenBreakTime("");
      setCloseBreakTime("");
      setRestDays([]);
      setDepositCheck(false);
      setProvideItems([]);
      setProvideTarget1("CHILD_ONLY");
      setProvideTarget2("");
      setSnsType1("");
      setSnsName1("");
      setSnsType2("");
      setSnsName2("");
      setStoreImgCI("");
      setStoreImgFront("");
      setStoreImgInside("");
      setStoreImgMenupan("");
      setStoreImgMenu("");
    } catch (error) {
      console.error("Error creating store:", error);
      toast({
        title: "Error creating store",
        description: "There was an error adding the store.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} width="100%" mx="auto" height="70vh" overflow="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">기본정보</Heading>
          <Divider borderColor="gray.900" borderWidth="1px" />
          <FormControl isRequired>
            <FormLabel fontSize="18px">회원구분</FormLabel>
            <RadioGroup value={level} onChange={setLevel}>
              <HStack spacing={4}>
                <Radio value="REGULAR_MEMBER">정회원</Radio>
                <Radio value="ASSOCIATE_MEMBER">준회원</Radio>
              </HStack>
            </RadioGroup>
            <Text fontSize="sm" color="gray.500" mt={2}>
              ※ 정회원은 협회 활동에 대한 참여 및 의결권을 가지고 협회사 대상
              지원 사업 우선권이 있으며, 매년 연회비(120,000원/매월1만원
              정기납부 결제가능) 납입의무가 있습니다.
              <br />※ 준회원은 협회 활동에 대한 의결권 및 연회비 납입의무가
              없습니다.
            </Text>
          </FormControl>
          <FormControl isRequired isInvalid={errors.businessNumber}>
            <FormLabel fontSize="18px">사업자 등록번호</FormLabel>
            <Input
              type="text"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              placeholder="사업자 번호"
            />
            <FormErrorMessage>{errors.businessNumber}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.enrollDate}>
            <Input
              type="date"
              value={enrollDate}
              onChange={(e) => setEnrollDate(e.target.value)}
              placeholder="가입 연월일"
            />
            <FormErrorMessage>{errors.enrollDate}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.representativeName}>
            <Input
              type="text"
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
              placeholder="대표자 성명"
            />
            <FormErrorMessage>{errors.representativeName}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="18px">이름</FormLabel>
            <Input
              type="text"
              value={ceoName}
              onChange={(e) => setCeoName(e.target.value)}
              placeholder="이름을 입력하세요."
            />
            <FormErrorMessage>{errors.ceoName}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="18px">이메일</FormLabel>
            <Input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              placeholder="이메일을 입력해주세요."
            />
            <FormErrorMessage>{errors.storeEmail}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="18px">휴대폰</FormLabel>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="'-'을 포함해 입력해주세요"
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="18px">비밀번호</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요."
            />
            <Text fontSize="sm" color="gray.500">
              ※ 영문 대소문자/숫자/특수문자 조합, 10자-16자
            </Text>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="18px">비밀번호 확인</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요."
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          <Heading size="lg" mt={8}>
            가게정보
          </Heading>
          <Divider borderColor="gray.900" borderWidth="1px" />
          <FormControl isRequired>
            <FormLabel fontSize="18px">상호명</FormLabel>
            <Input
              type="text"
              value={storeTitle}
              onChange={(e) => setStoreTitle(e.target.value)}
              placeholder="상호명을 입력하세요."
            />
            <FormErrorMessage>{errors.storeTitle}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="18px">업종</FormLabel>
            <Select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            >
              <option value="식음료">식음료</option>
              <option value="교육">교육</option>
              <option value="생활">생활</option>
              <option value="기타">기타</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="18px">매장번호</FormLabel>
            <VStack spacing={4} align="flex-start">
              <RadioGroup
                value={seeAvailable ? "true" : "false"}
                onChange={(value) => setSeeAvailable(value === "true")}
              >
                <HStack>
                  <Radio value="true">공개</Radio>
                  <Radio value="false">비공개</Radio>
                </HStack>
              </RadioGroup>
              <Input
                type="text"
                placeholder="'-'을 포함해 번호를 입력해주세요."
                value={storePhoneNumber}
                onChange={(e) => setStorePhoneNumber(e.target.value)}
              />
            </VStack>
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="18px">주소</FormLabel>
            <VStack>
              <Input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder="우편번호"
              />
              <Input
                type="text"
                value={storeDetailAddress}
                onChange={(e) => setStoreDetailAddress(e.target.value)}
                placeholder="상세 주소 (선택)"
              />
            </VStack>
          </FormControl>
          <Heading size="lg" mt={8}>
            추가 정보
          </Heading>
          <Divider borderColor="gray.900" borderWidth="1px" />
          <FormControl>
            <FormLabel fontSize="18px">영업시간</FormLabel>
            <HStack>
              <Input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
              <Text>-</Text>
              <Input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="18px">브레이크 타임</FormLabel>
            <HStack>
              <Input
                type="time"
                value={openBreakTime}
                onChange={(e) => setOpenBreakTime(e.target.value)}
              />
              <Text>-</Text>
              <Input
                type="time"
                value={closeBreakTime}
                onChange={(e) => setCloseBreakTime(e.target.value)}
              />
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="18px">휴무일</FormLabel>
            <HStack spacing={4}>
              {[
                { restDays: "Monday", label: "월" },
                { restDays: "Tuesday", label: "화" },
                { restDays: "Wednesday", label: "수" },
                { restDays: "Thursday", label: "목" },
                { restDays: "Friday", label: "금" },
                { restDays: "Saturday", label: "토" },
                { restDays: "Sunday", label: "일" },
                { restDays: "National Holiday", label: "공휴일" },
              ].map(({ restDays, label }) => (
                <Checkbox
                  key={restDays}
                  value={restDays}
                  onChange={(e) =>
                    setRestDays((prev) =>
                      e.target.checked
                        ? [...prev, restDays]
                        : prev.filter((item) => item !== restDays)
                    )
                  }
                >
                  {label}
                </Checkbox>
              ))}
            </HStack>
          </FormControl>
          <FormLabel fontSize="18px">제공 품목</FormLabel>
          {provideItems.map((item, index) => (
            <Box key={index} p={4} borderWidth="1px" borderRadius="18px" mb={4}>
              <FormControl>
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleProvideItemChange(index, "name", e.target.value)
                  }
                  placeholder="품목 이름"
                />
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  value={item.existingPrice}
                  onChange={(e) =>
                    handleProvideItemChange(
                      index,
                      "existingPrice",
                      e.target.value
                    )
                  }
                  placeholder="기존 가격"
                />
              </FormControl>
              <FormControl>
                <Input
                  type="number"
                  value={item.providePrice}
                  onChange={(e) =>
                    handleProvideItemChange(
                      index,
                      "providePrice",
                      e.target.value
                    )
                  }
                  placeholder="제공 가격"
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor={`freeProvide${index}`} mb={0}>
                  무료 제공 여부
                </FormLabel>
                <Checkbox
                  id={`freeProvide${index}`}
                  isChecked={item.freeProvide}
                  onChange={(e) =>
                    handleProvideItemChange(
                      index,
                      "freeProvide",
                      e.target.checked
                    )
                  }
                />
              </FormControl>
              {/* TODO: 제공품목 유효성 검사 코드 부분 위로 올리기 */}
              {errors[`provideItem${index}`] && (
                <Text color="red.500">{errors[`provideItem${index}`]}</Text>
              )}
            </Box>
          ))}
          <FormControl>
            <FormLabel fontSize="18px">제공대상1</FormLabel>
            <RadioGroup
              value={provideTarget1}
              onChange={(value) => setProvideTarget1(value)}
            >
              <HStack>
                <Radio value="CHILD_ONLY">아이 본인만</Radio>
                <Radio value="WITH_ONE">동반 1인</Radio>
                <Radio value="WITH_TWO">동반 2인</Radio>
                <Radio value="OTHER">기타</Radio>
                {/* 기타 선택할 경우 사용자 입력할 수 있도록 Input 활성화 시키기 */}
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="18px">제공대상2</FormLabel>
            <HStack spacing={4}>
              {[
                { provideTarget2: "UNDERPRIVILEGED_CHILD", label: "결식아동" },
                { provideTarget2: "FIREFIGHTER", label: "소방관" },
                { provideTarget2: "OTHER", label: "기타" },
              ].map(({ provideTarget2, label }) => (
                <Checkbox
                  key={provideTarget2}
                  value={provideTarget2}
                  onChange={(e) =>
                    setProvideTarget2((prev) =>
                      e.target.checked
                        ? [...prev, provideTarget2]
                        : prev.filter((item) => item !== provideTarget2)
                    )
                  }
                >
                  {label}
                </Checkbox>
              ))}
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="18px">가게 SNS</FormLabel>
            <HStack>
              <Select
                value={snsType1}
                onChange={(e) => setSnsType1(e.target.value)}
              >
                <option value="식음료">인스타그램</option>
                <option value="교육">카카오</option>
                <option value="생활">유튜브</option>
                <option value="기타">트위터</option>
                <option value="기타">밴드</option>
                <option value="기타">네이버 블로그</option>
                <option value="기타">기타</option>
              </Select>
              <Input
                type="text"
                value={snsName1}
                onChange={(e) => setSnsName1(e.target.value)}
                placeholder="가게 SNS를 입력하세요."
              />
            </HStack>
            <HStack>
              <Select
                value={snsType2}
                onChange={(e) => setSnsType2(e.target.value)}
              >
                <option value="식음료">인스타그램</option>
                <option value="교육">카카오</option>
                <option value="생활">유튜브</option>
                <option value="기타">트위터</option>
                <option value="기타">밴드</option>
                <option value="기타">네이버 블로그</option>
                <option value="기타">기타</option>
              </Select>
              <Input
                type="text"
                value={snsName2}
                onChange={(e) => setSnsName2(e.target.value)}
                placeholder="가게 SNS를 입력하세요."
              />
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="18px">사진첨부</FormLabel>
            <VStack spacing={4} align="start">
              <HStack>
                <FormLabel>상호명(CI)</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setStoreImgCI(URL.createObjectURL(file));
                    }
                  }}
                />
              </HStack>
              <HStack>
                <FormLabel>가게전면</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setStoreImgFront(URL.createObjectURL(file));
                    }
                  }}
                />
              </HStack>
              <HStack>
                <FormLabel>가게내부</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setStoreImgInside(URL.createObjectURL(file));
                    }
                  }}
                />
              </HStack>
              <HStack>
                <FormLabel>메뉴판</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setStoreImgMenupan(URL.createObjectURL(file));
                    }
                  }}
                />
              </HStack>
              <HStack>
                <FormLabel>대표메뉴</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setStoreImgMenu(URL.createObjectURL(file));
                    }
                  }}
                />
              </HStack>
              <Text fontSize="sm" color="gray.500" mt={2}>
                * 5MB 이하의 jpg, jpeg, gif, png 이미지만 업로드 가능
              </Text>
            </VStack>
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full" mt={4}>
            매장 등록
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default StoreForm;
