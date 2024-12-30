import React, { useRef, useState, useContext, useEffect } from "react";
import {
  Box,
  HStack,
  Center,
  Image,
  Icon,
  Pressable,
  Link,
} from "../../components/ui";
import { ScrollView } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { ThemeContext } from "../../App";

const BASE_URL = "http://192.168.1.9:8000";

const NewThisWeekFold = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isContentAtRight, setIsContentAtRight] = useState(false);
  const [data, setData] = useState<Array<{post_link: string, post_image: string}>>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/admins/posts/active/`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleScrollLeft = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: -400, animated: true });
    }
  };

  const handleScrollRight = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 400, animated: true });
    }
  };

  const isCloseToRight = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    return contentOffset.x + layoutMeasurement.width >= contentSize.width;
  };

  return (
    <Box className="w-full">
      <ScrollView
        horizontal
        style={{ width: "100%" }}
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={(event) => {
          setIsContentAtRight(isCloseToRight(event));
        }}
        scrollEventThrottle={16}
      >
        <HStack space="md" className="w-full px-4 md:px-0">
          {data.map((item, index) => (
            <Box key={index} className="flex-1">
              <Link href={item.post_link}>
                <Image
                  source={{ uri: `${BASE_URL}${item.post_image}` }}
                  alt={"place" + index}
                  className="w-64 h-64 rounded-md"
                  resizeMode="cover"
                />
              </Link>
            </Box>
          ))}
        </HStack>
      </ScrollView>
      <ScrollLeft handleScrollLeft={handleScrollLeft} />
      <ScrollRight handleScrollRight={handleScrollRight} disabled={!isContentAtRight} />
    </Box>
  );
};

const ScrollLeft = ({ handleScrollLeft }: { handleScrollLeft: () => void }) => {
  const { colorMode } = useContext(ThemeContext);
  return (
    <Center className="absolute left-0 h-full hidden md:flex">
      <Pressable
        className="p-1 ml-3 rounded-full border-outline-300 border bg-background-50 md:-ml-[16px] hover:bg-background-100"
        onPress={handleScrollLeft}
      >
        <Icon
          as={ChevronLeft}
          size="lg"
          color={colorMode === "light" ? "#535252" : "#DCDBDB"}
        />
      </Pressable>
    </Center>
  );
};

const ScrollRight = ({ handleScrollRight, disabled }: { handleScrollRight: () => void, disabled: boolean }) => {
  const { colorMode } = useContext(ThemeContext);
  return (
    <Center className="absolute right-0 h-full hidden md:flex">
      <Pressable
        className={`p-1 ml-3 rounded-full border-outline-300 border bg-background-50 md:-mr-4 hover:bg-background-100 ${
          disabled ? "opacity-0" : "opacity-100"
        }`}
        onPress={handleScrollRight}
        disabled={disabled}
      >
        <Icon
          as={ChevronRight}
          size="lg"
          color={colorMode === "light" ? "#535252" : "#DCDBDB"}
        />
      </Pressable>
    </Center>
  );
};

export default NewThisWeekFold;
