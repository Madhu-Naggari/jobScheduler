import Home from "@/app/Home";
import ProtectedRoute from "./ProtectedRoute";

const Page = async () => {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
};

export default Page;
