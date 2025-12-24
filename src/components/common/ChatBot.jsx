import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Flex,
  Avatar,
  ScaleFade,
  useColorModeValue,
  Spinner,
  Badge,
  Tooltip
} from '@chakra-ui/react';
import { IoSend, IoClose, IoChatbubbleEllipses } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import CopilotService from '../../services/copilot.service';

const MotionBox = motion(Box);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Chào bạn! Mình là VNTech AI. Mình có thể giúp gì cho bạn hôm nay?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const userBubbleBg = 'blue.500';
  const aiBubbleBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      const res = await CopilotService.chat(chatHistory);
      
      // axiosClient đã return response.data ở interceptor
      // Kết quả từ backend là { content: "..." }
      let aiContent = res.content || 'Xin lỗi, mình đang gặp sự cố kết nối.';
      
      // Xóa định dạng markdown ** và các dấu gạch đầu dòng -
      aiContent = aiContent.replace(/\*\*/g, ''); // Xóa **
      aiContent = aiContent.replace(/^[ \t]*[-*][ \t]+/gm, ''); // Xóa dấu gạch đầu dòng hoặc dấu sao ở đầu dòng
      
      const aiResponse = { 
        role: 'assistant', 
        content: aiContent
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat AI Error:', error);
      let errorMessage = 'Có lỗi xảy ra khi kết nối với máy chủ AI.';
      
      if (error.response) {
        // Server phản hồi với status code bên ngoài 2xx
        if (error.response.status === 404) {
          errorMessage = 'Lỗi 404: Không tìm thấy endpoint /copilot. Vui lòng kiểm tra lại backend.';
        } else if (error.response.status === 500) {
          errorMessage = 'Lỗi 500: Server AI gặp sự cố. Có thể Ollama chưa được bật.';
        }
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được phản hồi
        errorMessage = 'Không nhận được phản hồi từ server backend.';
      }

      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <Box position="fixed" bottom="90px" right="20px" zIndex="10000">
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            w={{ base: "320px", md: "400px" }}
            h="500px"
            bg={bgColor}
            borderRadius="2xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor={borderColor}
            overflow="hidden"
            display="flex"
            flexDirection="column"
            mb="4"
            style={{ backdropFilter: 'blur(10px)', backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)') }}
          >
            {/* Header */}
            <Flex
              p="4"
              bg="blue.600"
              color="white"
              align="center"
              justify="space-between"
            >
              <HStack spacing="3">
                <Avatar size="sm" name="VNTech AI" bg="white" color="blue.600" icon={<IoChatbubbleEllipses size="20px"/>} />
                <Box>
                  <Text fontWeight="bold" fontSize="md">VNTech Assistant</Text>
                  <HStack spacing="1">
                    <Box w="2" h="2" bg="green.400" borderRadius="full" />
                    <Text fontSize="xs">Trực tuyến</Text>
                  </HStack>
                </Box>
              </HStack>
              <IconButton
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: 'blue.500' }}
                icon={<IoClose size="20px" />}
                onClick={() => setIsOpen(false)}
              />
            </Flex>

            {/* Messages */}
            <VStack
              flex="1"
              p="4"
              spacing="4"
              overflowY="auto"
              align="stretch"
              css={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '10px' },
              }}
              ref={scrollRef}
            >
              {messages.map((msg, idx) => (
                <Flex
                  key={idx}
                  justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                >
                  <Box
                    maxW="80%"
                    p="3"
                    borderRadius="2xl"
                    boxShadow="sm"
                    bg={msg.role === 'user' ? userBubbleBg : aiBubbleBg}
                    color={msg.role === 'user' ? 'white' : 'inherit'}
                    borderBottomRightRadius={msg.role === 'user' ? '4px' : '2xl'}
                    borderBottomLeftRadius={msg.role === 'user' ? '2xl' : '4px'}
                  >
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {msg.content}
                    </Text>
                  </Box>
                </Flex>
              ))}
              {isLoading && (
                <Flex justifyContent="flex-start">
                  <Box
                    p="3"
                    borderRadius="2xl"
                    bg={aiBubbleBg}
                    boxShadow="sm"
                    borderBottomLeftRadius="4px"
                  >
                    <HStack spacing="1">
                      <Spinner size="xs" color="blue.500" />
                      <Text fontSize="xs" fontStyle="italic">AI đang suy nghĩ...</Text>
                    </HStack>
                  </Box>
                </Flex>
              )}
            </VStack>

            {/* Input */}
            <Box p="4" borderTop="1px solid" borderColor={borderColor}>
              <HStack>
                <Input
                  placeholder="Nhập câu hỏi tại đây..."
                  variant="filled"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  _focus={{ bg: useColorModeValue('gray.50', 'gray.700'), borderColor: 'blue.500' }}
                />
                <IconButton
                  colorScheme="blue"
                  icon={<IoSend />}
                  onClick={handleSend}
                  isLoading={isLoading}
                  borderRadius="full"
                />
              </HStack>
              <Text fontSize="10px" textAlign="center" mt="2" color="gray.500">
                Powered by VNTech RAG AI
              </Text>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      <Tooltip label="Trò chuyện với AI" placement="left">
        <IconButton
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          icon={<IoChatbubbleEllipses size="28px" />}
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          boxShadow="xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Chat"
          position="relative"
        >
          {!isOpen && (
             <Box
             position="absolute"
             top="-2px"
             right="-2px"
             w="3"
             h="3"
             bg="red.500"
             borderRadius="full"
             border="2px solid white"
           />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ChatBot;
