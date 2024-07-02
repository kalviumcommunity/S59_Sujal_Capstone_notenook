import otpSideImg from "../../assets/otpSideImg.png";
import { motion } from "framer-motion";
import { Card, CardTitle, CardDescription, CardHeader } from "../ui/card";

function OTPSideImg({ userData }) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="sideImgContainer max-w-[80vw] w-fit rounded-[5%] p-6 relative mt-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <img
        src={otpSideImg}
        alt="sideImg"
        className="sideImg relative w-[500px] max-w-[60vw] rounded-[5%]"
      />
      <Card className="absolute w-96 bottom-4 translate-y-1/2 xl:translate-y-0 xl:-right-8 left-1/2 -translate-x-1/2 xl:translate-x-0">
        <CardHeader>
          <CardTitle>Check your mail!</CardTitle>
          <CardDescription>
            The otp has been mailed to {userData?.email}.
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export default OTPSideImg;
