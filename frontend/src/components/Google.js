import { Box, Center, Flex, Image } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/Google.svg";
import { MdContentCopy } from "react-icons/md";
import { RiVolumeUpLine } from "react-icons/ri";
import Context from "../contexts/context";

export default function Google() {
  const {
    originalText,
    toast,
    targetLanguage,
    copyToClipboard,
    speak,
    showDiff,
    originalLanguage,diffs,googleTranslation,setGoogleTranslation
  } = useContext(Context);
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const id = "test-toast";

  const fetchTranslations = async (text, target_lang) => {
    setLoading(true);
    const res = await fetch("https://api.transdigi.xyz/api/g/translate", {
      method: "POST",
      mode: "cors",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `&text=${text}&target_lang=${target_lang}&source_lang=${originalLanguage.code}`,
    });

    const translations = await res.json();
    setGoogleTranslation(JSON.parse(translations));
    setLoading(false);
  };

  const handleCopy = () => {
    toast.close(id);
    copyToClipboard(googleTranslation.translation);
    // if (!toast.isActive(id)) {
    toast({
      // id,
      title: "Translation copied!",
      duration: 1000,
      status: "warning",
    });
    // }
  };

  useEffect(() => {
    if (originalText && originalLanguage.code && targetLanguage.code) {
      // Fetch Translations from Google endpoint

      fetchTranslations(originalText, targetLanguage.code).catch((e) => {
        setLoading(false);
        console.log(e.message);
      });
    }
    
    if(originalText === null) {
      setTranslation('')
     }

    return () => {
      console.log("");
    };
  }, [originalText, targetLanguage]);

  return (
    <Flex w={"100%"} h={"auto"} flexDirection={'column'}>
      <Box
        h={"100%"}
        contentEditable={true}
        outline={"none"}
        w={"100%"}
        p={"4%"}
        minH={'170px'}

      >
      {showDiff
          ? diffs.map((part, index) => {
              if (!part.added) {
                return (
                  <span key={index} className={part.removed ? "removed" : ""}>
                    {part.value}
                  </span>
                );
              }
            })
          : googleTranslation?.translation}{loading && '......'}
      </Box>
      <Flex justifyContent={"space-around"} p={"3%"} w={"100%"}>
        <Image src={logo} />
        <Flex justifyContent={"space-evenly"} w={"20%"}>
          <Center onClick={handleCopy} cursor={"pointer"}>
            <MdContentCopy size={24} color={"#A9A5A5"} />
          </Center>
          <Center
            onClick={() => speak({ text: googleTranslation.translation })}
            cursor={"pointer"}
          >
            <RiVolumeUpLine size={24} color={"#A9A5A5"} />
          </Center>
        </Flex>
      </Flex>
    </Flex>
  );
}
