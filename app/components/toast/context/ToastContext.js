import { createContext, useReducer, useContext } from "react";

const ToastStateContext = createContext({ toasts: [] });
const ToastDispatchContext = createContext(null);

function ToastReducer(state, action) {
	switch (action.type) {
		case "ADD_TOAST": {
			return {
				...state,
				toasts: [...state.toasts, action.toast],
			};
		}
		
		default: {
			throw new Error("unhandled action");
		}
	}
}

export function ToastProvider({ children }) {
	const [state, dispatch] = useReducer(ToastReducer, {
		toasts: [],
	});

	return (
		<ToastStateContext.Provider value={state}>
			<ToastDispatchContext.Provider value={dispatch}>{children}</ToastDispatchContext.Provider>
		</ToastStateContext.Provider>
	);
}

export const useToastStateContext = () => useContext(ToastStateContext);
export const useToastDispatchContext = () => useContext(ToastDispatchContext);