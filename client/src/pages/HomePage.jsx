import "../css/HomePage.css";

import { Separator } from "@radix-ui/react-separator";

import WelcomeText from "../components/HomePageComponents/WelcomeText";
import SideImage from "../components/HomePageComponents/SideImage";
import HomeNavBar from "../components/HomePageComponents/HomeNavBar";
import AboutSection from "../components/HomePageComponents/AboutSection";
import HowToGetStarted from "../components/HomePageComponents/HowToGetStarted";
import HomePageFooter from "../components/HomePageComponents/HomePageFooter";

function HomePage() {
  return (
    <div className="overflow-x-hidden pb-24">
      <HomeNavBar />
      <div className="flex flex-col xl:flex-row gap-12 px-4 xl:px-20 xl:pb-40 pt-20 xl:pt-0 items-center justify-between min-h-[90vh]">
        <WelcomeText />
        <SideImage />
      </div>
      <AboutSection />
      <HowToGetStarted />
      <Separator className="h-[1px] w-[90vw] m-auto bg-slate-50" />
      <HomePageFooter />
    </div>
  );
}

export default HomePage;
