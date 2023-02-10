import { useToastDispatchContext } from "../context/ToastContext";

export function useToastMsgDispatch() {
	const dispatch = useToastDispatchContext();

	function toast(type, message) {
		const id = Math.random().toString(36).substring(2, 9);
		dispatch({
			type: "ADD_TOAST",
			toast: {
				type,
				message,
				id,
			},
		});

	}

	return toast;
}