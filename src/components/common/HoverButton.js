import { Button, Text } from "@chakra-ui/react";

const HoverButton = ({ title, w, h, textSize, data, onPass }) => {
  const handleValidation = async () => {
    // Implementation for button action can go here
  };

  return (
    <Button
      onClick={handleValidation}
      width={w}
      height={h}
      bg="white"
      border="1px solid"
      borderColor="skyblue"
      color="black"
      _hover={{ bg: "skyblue", color: "white" }}
      transition="background-color 0.3s"
    >
      <Text fontSize={textSize} fontWeight="medium">
        {title}
      </Text>
    </Button>
  );
};

export default HoverButton;
