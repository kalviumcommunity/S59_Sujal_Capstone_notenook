import { useContext } from "react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UpdateUserForm from "../../components/Forms/UpdateUserInfoForm";
import UpdatePasswordForm from "../../components/Forms/UpdatePasswordForm";

import { UserContext } from "../../context/userContext";

import pic from "../../assets/pic.png";
function EditUserDetailsPage() {
  const { user } = useContext(UserContext);
  return (
    <div className="page w-[500px] max-w-[90vw] m-auto">
      <Link to="/notenook/profile">
        <div className="flex items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={pic} />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div>
            <CardHeader>
              <CardTitle>{user?.username}</CardTitle>
              <CardDescription>{user?.fullname}</CardDescription>
            </CardHeader>
          </div>
        </div>
      </Link>

      <Tabs defaultValue="Details" className="w-full flex flex-col">
        <TabsList
          style={{ backgroundColor: "#09090b", alignSelf: "flex-start" }}
        >
          <TabsTrigger value="Details">Details</TabsTrigger>
          <TabsTrigger value="Password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="Details">
          <UpdateUserForm username={user?.username} fullname={user?.fullname} />
        </TabsContent>
        <TabsContent value="Password">
          <UpdatePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EditUserDetailsPage;
