import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  Icon,
  Image,
  Pressable,
  Text,
  VStack,
  Tooltip,
  TooltipContent,
  TooltipText,
  StarIcon,
} from "../../components/ui";
import { ChevronRight, Heart } from "lucide-react-native";
import { AnimatePresence, Motion } from "@legendapp/motion";
import { ScrollView } from "react-native";

// Define the base URL for API
const BASE_URL = "http://192.168.1.9:8000";

const HomestayInformationFold = () => {
  const [tabsData, setTabsData] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [likes, setLikes] = useState([]);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admins/category/items/`);
        const data = await response.json();
        // Convert the fetched data into the format expected by the component
        setTabsData(Object.keys(data).map((category) => ({
          name: category,
          data: data[category],
        })));
        setActiveTab(Object.keys(data)[0]);  // Set the first category as active
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!tabsData.length || !activeTab) return null;  // Wait for data to load

  return (
    <Box className="pb-8 px-4 md:px-0">
      <HomestayInfoTabs
        tabs={tabsData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <TabPanelData
        activeTab={activeTab}
        tabsData={tabsData}
        likes={likes}
        setLikes={setLikes}
      />
    </Box>
  );
};

const HomestayInfoTabs = ({ tabs, activeTab, setActiveTab }: any) => {
  return (
    <Box className="border-b border-outline-50 md:border-b-0 md:border-transparent">
      <Box className="py-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="lg" className="mx-0.5 xl:gap-5 2xl:gap-6">
            {tabs.map((tab: any) => {
              return (
                <Pressable
                  key={tab.name}
                  className={`my-0.5 py-1 ${
                    activeTab === tab.name ? "border-b-[3px]" : "border-b-0"
                  } border-outline-900 hover:border-b-[3px] ${
                    activeTab === tab.name
                      ? "hover:border-outline-900"
                      : "hover:border-outline-200"
                  } `}
                  onPress={() => setActiveTab(tab.name)}
                >
                  <Text
                    size="sm"
                    className={`${
                      activeTab === tab.name
                        ? "text-typography-900"
                        : "text-typography-600"
                    } font-medium`}
                  >
                    {tab.name}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
};

const TabPanelData = ({ activeTab, tabsData, likes, setLikes }: any) => {
  const tabData = tabsData.find((tab: any) => tab.name === activeTab);

  return (
    <VStack className="justify-between lg:flex-row">
      {tabData && tabData.data.map((item: any, index: any) => {
        return (
          <Box
            key={index}
            className={`flex-1 my-2 lg:my-0 ${index === 0 ? "lg:ml-0" : "lg:ml-2"} ${index === tabData.data.length - 1 ? "lg:mr-0" : "lg:mr-2"}`}
          >
            <Pressable className="w-full">
              {(props: any) => {
                return (
                  <>
                    <Box className="overflow-hidden rounded-md h-72">
                      <Image
                        source={{ uri: `${BASE_URL}/${tabData.data[0].images[0].image}` }}
                        className={`w-full h-72 ${
                          props.hovered ? "scale-[1.04] opacity-90" : "scale-100 opacity-100"
                        }`}
                        alt="Explore"
                      />
                    </Box>
                    {props.hovered && (
                      <Box className="absolute bg-[#181718] opacity-30 w-full h-full cursor-pointer" />
                    )}
                    <Box
                      className={`absolute top-[45%] bg-transparent rounded border border-white self-center content-center py-1.5 px-4 flex-row ${
                        props.hovered ? "flex" : "hidden"
                      }`}
                    >
                      <Text className="text-white">Explore</Text>
                      <Icon
                        as={ChevronRight}
                        size="sm"
                        className="self-center"
                        color="white"
                      />
                    </Box>
                  </>
                );
              }}
            </Pressable>

            <Pressable
              onPress={() => {
                const newLikes = likes.includes(item.title)
                  ? likes.filter((like: any) => like !== item.title)
                  : [...likes, item.title];
                setLikes(newLikes);
              }}
              className="absolute top-3 right-4 h-6 w-6 justify-center items-center"
            >
              <AnimatePresence>
                <Motion.View
                  key={likes.includes(item.title) ? "liked" : "unliked"}
                  initial={{
                    scale: 1.3,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  exit={{
                    scale: 0.9,
                  }}
                  transition={{
                    type: "spring",
                    mass: 0.9,
                    damping: 9,
                    stiffness: 300,
                  }}
                  style={{
                    position: "absolute",
                  }}
                >
                  <Icon
                    as={Heart}
                    size="lg"
                    className={`${
                      likes.includes(item.title)
                        ? "fill-red-500 stroke-red-500"
                        : "fill-gray-500 stroke-white"
                    }`}
                  />
                </Motion.View>
              </AnimatePresence>
            </Pressable>

            <HStack className="justify-between py-2 items-start">
              <VStack space="sm" className="flex-1">
                <Text className="font-semibold text-typography-900">
                  {item.name}
                </Text>
                <Text size="sm" className="text-typography-500">
                  {item.description}
                </Text>
              </VStack>
              <Tooltip
                trigger={(triggerProps: any) => {
                  return (
                    <Pressable {...triggerProps}>
                      <HStack className="items-center flex-start">
                        <Text size="sm" className="text-typography-900">
                          ₹
                        </Text>
                        <Text
                          size="sm"
                          className="pl-1 text-typography-900"
                        >
                          {item.price}
                        </Text>
                      </HStack>
                    </Pressable>
                  );
                }}
              >
                <TooltipContent>
                  <TooltipText className="text-white px-2 py-1">
                    Ratings
                  </TooltipText>
                </TooltipContent>
              </Tooltip>
            </HStack>
          </Box>
        );
      })}
    </VStack>
  );
};

export default HomestayInformationFold;
