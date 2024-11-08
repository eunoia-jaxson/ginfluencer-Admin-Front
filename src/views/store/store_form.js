import { useState, useEffect } from "react";
import axios from "axios";
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
import {
  MembershipLevel,
  Category,
  ProvideTarget1,
  ProvideTarget2,
} from "../../constants/admin";

const StoreForm = ({ fetchAllStores }) => {
  const [level, setLevel] = useState(MembershipLevel.ASSOCIATE_MEMBER);
  const [businessNumber, setBusinessNumber] = useState("");
  const [enrollDate, setEnrollDate] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storeTitle, setStoreTitle] = useState("");
  const [businessTypeBig, setBusinessTypeBig] = useState(null);
  const [businessTypeMiddle, setBusinessTypeMiddle] = useState("");
  const [storePhoneNumber, setStorePhoneNumber] = useState("");
  const [seeAvailable, setSeeAvailable] = useState(true);
  const [storeAddress, setStoreAddress] = useState("");
  const [storeDetailAddress, setStoreDetailAddress] = useState("");
  // time -> String 아니고 LocalDateTime(java.time.LocalDateTime)으로 불러와야 함
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [openBreakTime, setOpenBreakTime] = useState("");
  const [closeBreakTime, setCloseBreakTime] = useState("");
  const [holiDays, setHoliDays] = useState([]);
  const [depositCheck, setDepositCheck] = useState(false);
  const [provideItems, setProvideItems] = useState([
    {
      name: "",
      existingPrice: "",
      providePrice: "",
      freeProvide: false,
    },
  ]);
  const [provideTarget1, setProvideTarget1] = useState(
    ProvideTarget1.CHILD_ONLY
  );
  const [provideTarget2, setProvideTarget2] = useState([]);
  const [snsType1, setSnsType1] = useState("");
  const [snsType1Url, setSnsType1Url] = useState("");
  const [snsType2, setSnsType2] = useState("");
  const [snsType2Url, setSnsType2Url] = useState("");
  const [storeImgCI, setStoreImgCI] = useState("");
  const [storeImgFront, setStoreImgFront] = useState("");
  const [storeImgInside, setStoreImgInside] = useState("");
  const [storeImgMenupan, setStoreImgMenupan] = useState("");
  const [storeImgMenu, setStoreImgMenu] = useState("");

  const [no, setNo] = useState(0);
  const [stickerSend, setStickerSend] = useState(false);
  const [kitSend, setKitSend] = useState(false);
  const [opened, setOpened] = useState(false);

  const [errors, setErrors] = useState({});
  const toast = useToast();

  const middleOptions = businessTypeBig
    ? Object.keys(businessTypeBig.subCategories).map((key) => ({
        value: key,
        label: businessTypeBig.subCategories[key],
      }))
    : [];

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
    // if (!validateForm()) return;

    const storeData = {
      no,
      stickerSend,
      kitSend,
      opened,
      level,
      businessNumber,
      ceoName,
      storeEmail,
      phoneNumber,
      password,
      confirmPassword,
      storeTitle,
      businessTypeBig,
      businessTypeMiddle,
      storePhoneNumber,
      seeAvailable,
      storeAddress,
      storeDetailAddress,
      openTime,
      closeTime,
      openBreakTime,
      closeBreakTime,
      holiDays,
      depositCheck,
      provideItems,
      provideTarget1,
      provideTarget2,
      snsType1,
      snsType1Url,
      snsType2,
      snsType2Url,
      storeImgCI,
      storeImgFront,
      storeImgInside,
      storeImgMenupan,
      storeImgMenu,
    };

    try {
      // await axiosInstance.post("/api/admin/stores/create", storeData);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/admin/stores/create`,
        storeData,
        {
          headers: {
            "Content-Type": "application/json", // JSON 형식으로 데이터를 전송
          },
        }
      );
      console.log("Store created:", response.data);
      fetchAllStores();
      toast({
        title: "Store added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form fields
      // setLevel("ASSOCIATE_MEMBER");
      // setBusinessNumber("");
      // setCeoName("");
      // setStoreEmail("");
      // setPhoneNumber("");
      // setPassword("");
      // setConfirmPassword("");
      // setStoreTitle("");
      // setBusinessTypeBig("");
      // setBusinessTypeMiddle("");
      // setStorePhoneNumber("");
      // setSeeAvailable(true);
      // setStoreAddress("");
      // setStoreDetailAddress("");
      // setOpenTime("");
      // setCloseTime("");
      // setOpenBreakTime("");
      // setCloseBreakTime("");
      // setHoliDays([]);
      // setDepositCheck(false);
      // setProvideItems([]);
      // setProvideTarget1("CHILD_ONLY");
      // setProvideTarget2("");
      // setSnsType1("");
      // setSnsType1Url("");
      // setSnsType2("");
      // setSnsType2Url("");
      // setStoreImgCI("");
      // setStoreImgFront("");
      // setStoreImgInside("");
      // setStoreImgMenupan("");
      // setStoreImgMenu("");
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

  // useEffect(() => {
  //   if (businessTypeBig) {
  //     setMiddleOptions(categoryData[businessTypeBig].subCategories);
  //     setBusinessTypeMiddle(""); // 선택 초기화
  //   } else {
  //     setMiddleOptions([]);
  //   }
  // }, [businessTypeBig]);
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
                <Radio value={MembershipLevel.REGULAR_MEMBER}>정회원</Radio>
                <Radio value={MembershipLevel.ASSOCIATE_MEMBER}>준회원</Radio>
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
          <FormControl isRequired isInvalid={errors.ceoName}>
            <Input
              type="text"
              value={ceoName}
              onChange={(e) => setCeoName(e.target.value)}
              placeholder="대표자 성명"
            />
            <FormErrorMessage>{errors.ceoName}</FormErrorMessage>
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
              type="text"
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
            {/* 대분류 (Category) 선택 */}
            <Select
              id="business-type-big"
              placeholder="대분류"
              value={businessTypeBig ? businessTypeBig.description : ""}
              onChange={(e) => {
                const selectedCategory = Category[e.target.value]; // Category 객체 찾기
                setBusinessTypeBig(selectedCategory);
                setBusinessTypeMiddle(""); // 대분류 변경 시 중분류 초기화
              }}
            >
              {Object.keys(Category).map((key) => (
                <option key={key} value={key}>
                  {Category[key].description}
                </option>
              ))}
            </Select>

            {/* 중분류 (SubCategory) 선택 */}
            <Select
              id="business-type-middle"
              placeholder="중분류"
              value={businessTypeMiddle}
              onChange={(e) => setBusinessTypeMiddle(e.target.value)}
              isDisabled={!businessTypeBig} // 대분류 선택이 없을 시 비활성화
            >
              {middleOptions.map((subCategory) => (
                <option key={subCategory.value} value={subCategory.value}>
                  {subCategory.label}
                </option>
              ))}
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
                id="postcode"
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder="우편번호"
              />
              <Input
                id="detail-address"
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
                id="open-time"
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
              <Text>-</Text>
              <Input
                id="close-time"
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
                id="open-break-time"
                type="time"
                value={openBreakTime}
                onChange={(e) => setOpenBreakTime(e.target.value)}
              />
              <Text>-</Text>
              <Input
                id="close-break-time"
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
                { holiDays: "Monday", label: "월" },
                { holiDays: "Tuesday", label: "화" },
                { holiDays: "Wednesday", label: "수" },
                { holiDays: "Thursday", label: "목" },
                { holiDays: "Friday", label: "금" },
                { holiDays: "Saturday", label: "토" },
                { holiDays: "Sunday", label: "일" },
                { holiDays: "National Holiday", label: "공휴일" },
                { holiDays: "Anytime", label: "상시 변경" },
              ].map(({ holiDays, label }) => (
                <Checkbox
                  key={holiDays}
                  id={`checkbox-${holiDays}`}
                  value={holiDays}
                  onChange={(e) =>
                    setHoliDays((prev) =>
                      e.target.checked
                        ? [...prev, holiDays]
                        : prev.filter((item) => item !== holiDays)
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
                <Radio value={ProvideTarget1.CHILD_ONLY}>아이 본인만</Radio>
                <Radio value={ProvideTarget1.WITH_ONE}>동반 1인</Radio>
                <Radio value={ProvideTarget1.WITH_TWO}>동반 2인</Radio>
                <Radio value={ProvideTarget1.OTHER}>기타</Radio>
                {/* 기타 선택할 경우 사용자 입력할 수 있도록 Input 활성화 시키기 */}
              </HStack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="18px">제공대상2</FormLabel>
            <HStack spacing={4}>
              {[
                {
                  provideTarget2: ProvideTarget2.UNDERPRIVILEGED_CHILD,
                  label: "결식아동",
                },
                { provideTarget2: ProvideTarget2.FIREFIGHTER, label: "소방관" },
                { provideTarget2: ProvideTarget2.OTHER, label: "기타" },
              ].map(({ provideTarget2, label }) => (
                <Checkbox
                  key={provideTarget2}
                  id={`checkbox-${provideTarget2}`}
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
                id="sns-type-1"
                placeholder="SNS"
                value={snsType1}
                onChange={(e) => setSnsType1(e.target.value)}
              >
                <option value="INSTA">Instagram</option>
                <option value="KAKAO">KakaoTalk</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="TWITTER">Twitter</option>
                <option value="BAND">Band</option>
                <option value="NBLOG">Naver Blog</option>
                <option value="ETC">Other</option>
              </Select>
              <Input
                id="sns-url-1"
                type="text"
                value={snsType1Url}
                onChange={(e) => setSnsType1Url(e.target.value)}
                placeholder="가게 SNS URL을 입력하세요."
              />
            </HStack>
            <HStack>
              <Select
                id="sns-type-2"
                placeholder="SNS"
                value={snsType2}
                onChange={(e) => setSnsType2(e.target.value)}
              >
                <option value="INSTA">Instagram</option>
                <option value="KAKAO">KakaoTalk</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="TWITTER">Twitter</option>
                <option value="BAND">Band</option>
                <option value="NBLOG">Naver Blog</option>
                <option value="ETC">Other</option>
              </Select>
              <Input
                id="sns-url-2"
                type="text"
                value={snsType2Url}
                onChange={(e) => setSnsType2Url(e.target.value)}
                placeholder="가게 SNS URL을 입력하세요."
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

          {/* 추가된 파라미터들 */}
          <FormControl isRequired>
            <FormLabel fontSize="18px">no</FormLabel>
            <Input
              type="number"
              value={no}
              onChange={(e) => setNo(e.target.value)}
              placeholder="고유 번호를 입력하세요."
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="18px">스티커 발송 여부</FormLabel>
            <Switch
              isChecked={stickerSend}
              onChange={(e) => setStickerSend(e.target.checked)}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="18px">키트 발송 여부</FormLabel>
            <Switch
              isChecked={kitSend}
              onChange={(e) => setKitSend(e.target.checked)}
            />
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
