import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config";
import state from "../store";
import { download } from "../assets/index";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { slideAnimation, fadeAnimation } from "../config/motion";
import {
  CustomButton,
  AIPicker,
  ColorPicker,
  FilePicker,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  //show tab content depending on the active tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );

      default:
        return null;
    }
  };
  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");
    setGeneratingImg(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/dalle", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          prompt,
        }),
      });
      const data = await response.json();
      if (data.photo) {
        handleDecals(type, `data:image/png;based64,${data.photo}`);
      }
      console.log("first");
      console.log(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };
  const handleDecals = (type, result) => {
    const DecalType = DecalTypes[type];
    state[DecalType.stateProperty] = result;
    if (!activeFilterTab[DecalType.filterTab]) {
      handleActiveFilterTab(DecalType.filterTab);
    }
  };
  const handleActiveFilterTab = (tabname) => {
    switch (tabname) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabname];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabname];
        break;

      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }
    setActiveFilterTab((prev) => {
      return {
        ...prev,
        [tabname]: !prev[tabname],
      };
    });
  };
  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key={"custom"}
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      setActiveEditorTab(tab.name);
                    }}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles={`w-fit px-4 py-2.5 font-bold text-sm`}
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                handleClick={() => handleActiveFilterTab(tab.name)}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
