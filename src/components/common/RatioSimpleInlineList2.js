import { useEffect, useState } from 'react';
import { Box, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';

const RatioSimpleInlineList = ({
  name,
  defaultValue = true,
  options,
  handleChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleInternalChange = (value) => {
    const selectedItem = options.find((item) => item.id.toString() === value);
    if (selectedItem) {
      const selectedCode = selectedItem.code;
      setSelectedValue(selectedCode);
      handleChange({ target: { name, value: selectedCode } });
    }
  };

  return (
    <RadioGroup
      onChange={handleInternalChange}
      value={options.find((item) => item.code === selectedValue)?.id.toString()}
    >
      <Stack direction={{ base: 'column', sm: 'row' }} spacing={6}>
        {options.map((option) => (
          <Box key={option.id} display="flex" alignItems="center">
            <Radio
              id={option.id}
              value={option.id.toString()}
              colorScheme="blue"
            />
            <Text
              as="label"
              htmlFor={option.id}
              ml={3}
              fontSize="sm"
              fontWeight="medium"
            >
              {option.value}
            </Text>
          </Box>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default RatioSimpleInlineList;
