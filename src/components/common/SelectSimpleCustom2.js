import { useEffect, useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Text,
  Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';

export default function SelectSimpleCustom({
  defaultValue,
  options,
  handleChange,
}) {
  const defaultOption = options.find((option) => option.code === defaultValue);
  const [selected, setSelected] = useState(defaultOption || options[0]);

  useEffect(() => {
    const newDefaultOption = options.find(
      (option) => option.code === defaultValue
    );
    if (newDefaultOption) {
      setSelected(newDefaultOption);
    }
  }, [defaultValue, options]);

  const handleSelectChange = (value) => {
    setSelected(value);
    handleChange({ target: { name: 'type', value: value.code } });
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        _focus={{ boxShadow: 'outline' }}
        _hover={{ bg: 'gray.50' }}
        textAlign="left"
        w="full"
        py={1.5}
        px={3}
      >
        <Text isTruncated>{selected.value}</Text>
      </MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleSelectChange(option)}
            _hover={{ bg: 'blue.500', color: 'white' }}
          >
            <Flex justify="space-between" align="center" w="full">
              <Text
                fontWeight={selected.code === option.code ? 'bold' : 'normal'}
              >
                {option.value}
              </Text>
              {selected.code === option.code && (
                <Icon as={CheckIcon} color="blue.500" />
              )}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
