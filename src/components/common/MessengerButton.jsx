import { Box, Link } from "@chakra-ui/react";
import { FaFacebookMessenger } from "react-icons/fa";

const MessengerButton = () => {
  return (
    <Link
      href="https://m.me/61584898455052"
      isExternal
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex="9999"
      bg="#0084FF"
      color="white"
      borderRadius="full"
      p="14px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _hover={{ bg: "#006AFF" }}
      aria-label="Chat Messenger"
    >
      <FaFacebookMessenger size={24} />
    </Link>
  );
};

export default MessengerButton;
