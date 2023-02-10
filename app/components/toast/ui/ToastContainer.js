import ShowToast from "./ShowToast";
import { useToastStateContext } from "../context/ToastContext";

export default function ToastContainer() {
	const { toasts } = useToastStateContext();
	
	return (
		<div>
			<div>
			{toasts &&
					toasts.map((toast) => <ShowToast id={toast.id} key={toast.id} type={toast.type} message={toast.message} />
					)}
			 
			</div>
		</div>
	);
}