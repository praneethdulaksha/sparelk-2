import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { TItem } from "../types";

interface ItemsState {
    loadingAllItems: boolean;
    loadingDiscountItems: boolean;
    allItems: TItem[] | null;
    discountItems: TItem[] | null;
    error: string | null;
}

const initialState: ItemsState = {
    loadingAllItems: false,
    loadingDiscountItems: false,
    allItems: null,
    discountItems: null,
    error: null,
};

// Fetch all items
export const fetchAllItems = createAsyncThunk<TItem[]>(
    "items/fetchAllItems",
    async () => {
        const response = await api.get("item/all");
        return response.data.data;
    }
);

// Fetch discount items
export const fetchDiscountItems = createAsyncThunk<TItem[]>(
    "items/fetchDiscountItems",
    async () => {
        const response = await api.get("item/discounts");
        return response.data.data;
    }
);

const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchAllItems
            .addCase(fetchAllItems.pending, (state) => {
                state.loadingAllItems = true;
            })
            .addCase(fetchAllItems.fulfilled, (state, action: PayloadAction<TItem[]>) => {
                state.loadingAllItems = false;
                state.allItems = action.payload;
            })
            .addCase(fetchAllItems.rejected, (state, action) => {
                state.loadingAllItems = false;
                state.allItems = null;
                state.error = action.error.message || "Failed to fetch all items.";
            })

            // Handle fetchDiscountItems
            .addCase(fetchDiscountItems.pending, (state) => {
                state.loadingDiscountItems = true;
            })
            .addCase(fetchDiscountItems.fulfilled, (state, action: PayloadAction<TItem[]>) => {
                state.loadingDiscountItems = false;
                state.discountItems = action.payload;
            })
            .addCase(fetchDiscountItems.rejected, (state, action) => {
                state.loadingDiscountItems = false;
                state.discountItems = null;
                state.error = action.error.message || "Failed to fetch discount items.";
            });
    },
});

export const itemsActions = itemsSlice.actions;
export default itemsSlice.reducer;
