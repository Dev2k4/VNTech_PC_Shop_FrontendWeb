import axiosClient from '../config/axiosClient';

const CopilotService = {
    chat: (messages) => {
        // messages: array of { role, content }
        return axiosClient.post('/copilot', { messages });
    }
};

export default CopilotService;
