// import storage from 'redux-persist/lib/storage'; // Thay vì getStorage
// import { persistStore, persistReducer } from 'redux-persist';
// import { configureStore } from '@reduxjs/toolkit';
// import { rootReducer } from './rootReducer';

// // Cấu hình persist
// const persistConfig = {
//   key: 'root',
//   storage, // Sử dụng storage thông thường từ redux-persist
// };

// // Tạo persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Tạo store với persisted reducer
// export const store = configureStore({
//   reducer: persistedReducer, // Sử dụng persistedReducer
// });

// // Tạo persistor
// export const persistor = persistStore(store);

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {counter: CounterState}
// export type AppDispatch = typeof store.dispatch;
