import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
} from "../config/motion";

import state from "../store";
import CustomButton from "../components/CustomButton";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth from Clerk

const Home = () => {
  const snap = useSnapshot(state);
  const { signOut } = useAuth(); // Get the signOut method from useAuth

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation("left")}>
          <motion.header {...slideAnimation("down")}>
            <div className="flex flex-row flex-end gap-10">
              {/* <img
                src="./threejs.png"
                alt="logo"
                className="w-8 h-8 object-contain"
              /> */}

              <CustomButton
                type="filled"
                title="Logout"
                handleClick={signOut}
                customStyles="ml-auto px-4 py-2.5 font-bold text-sm"
              />
            </div>
          </motion.header>
          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                LET'S
                <br className="xl:block hidden" />
                DO IT.
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-5"
            >
              <p className="max-w-md font-normal text-gray-600 text-base ">
                Create your unique and exclusive shirt with our brand-new 3D
                Customization tool.<strong>Unleash your imagination </strong>{" "}
                and define your own style.
              </p>
              <CustomButton
                type="filled"
                title="Customize It"
                handleClick={() => (state.intro = false)}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default Home;
