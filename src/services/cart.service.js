import axiosClient from '../config/axiosClient';

const CartService = {
    getCart: () => {
        return axiosClient.get('/cart');
    },

    addToCart: (data) => {
        const payload = {
            productId: parseInt(data.productId),
            quantity: parseInt(data.quantity)
        };
        return axiosClient.post('/cart/items', payload);
    },

    updateItem: (itemId, quantity) => {
        const payload = { quantity: parseInt(quantity) };
        return axiosClient.put(`/cart/items/${itemId}`, payload);
    },

    removeItem: (itemId) => {
        return axiosClient.delete(`/cart/items/${itemId}`);
    },

    getCount: () => {
        return axiosClient.get('/cart/count');
    },
    updateSelected: (itemIds, selected) => {

        return axiosClient.put('/cart/items/select', null, {
            params: {
                itemIds: itemIds.join(','),
                selected: selected
            }
        });
    }
};

export default CartService;