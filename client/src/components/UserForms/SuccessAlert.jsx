import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function SuccessAlert({ success, path }) {
  const getTitleAndDescription = (path) => {
    switch (path) {
      case "OTP verification":
        return {
          title: "Registration Successful!!",
          description: "Please verify the OTP sent to your e-mail to continue.",
          to: "/forms/verification",
        };
      case "Dashboard":
        return {
          title: "Login Successful",
          description: "Navigate to Dashboard.",
          to: "/notenook/dashboard",
        };
      case "Login":
        return {
          title: "OTP verified Successfully!!",
          description: "Please logged in.",
          to: "/forms/login",
        };
      default:
        return {
          title: "Action Required",
          description: "Please complete the required action.",
          to: "/",
        };
    }
  };

  const { title, description, to } = getTitleAndDescription(path);

  return (
    <AlertDialog open={success}>
      <AlertDialogContent className="w-[500px] max-w-[90vw] rounded-md bg-card border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link to={to}>
            <AlertDialogAction>{path}</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SuccessAlert;
