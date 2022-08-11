import {
  Alert,
  AlertIcon,
  Box,
  chakra,
  Center,
  Heading,
  Text,
  Stack,
  Flex,
  Input,
  Select,
  Textarea,
  Button,
  Container,
  FormLabel,
  FormErrorMessage,
  FormControl
} from "@chakra-ui/react";

import { FieldValues, useForm } from "react-hook-form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import PageLayout from "../../components/layout/page";

const RequestTerm = () => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();

  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setIssueResult] = useState<string>("");
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  useEffect(() => {
    recaptchaRef.current?.execute();
    return () => {
      recaptchaRef.current?.reset()
    }
  }, [captchaToken, isSubmitting])

  const _onSubmit = async (formEntries: FieldValues) => {
    const { term, category, reason } = formEntries;
    const body = { term, category, reason, captchaToken };
    const headers = {
      'Content-type': "application/json"
    };

    try {
      const response = await fetch("/api/request-term/request-new-term", { headers, body: JSON.stringify(body), method: "POST" })
      const result = await response.json()
      if (response.status === 200) {
        setIssueResult(result.msg);
        recaptchaRef.current?.reset();
      } else {
        setError(result.msg)
        recaptchaRef.current?.reset();
      }
    } catch (error: any) {
      setError(error?.message);
      recaptchaRef.current?.reset();
    }
  }

  const handleRecaptchChange = (token: string | null) => {
    if (!token) return;
    else setCaptchaToken(token);
  }

  return (
    <PageLayout>
      <chakra.main>
        {error && <Alert status="error" zIndex={1}>
          <AlertIcon />
          {error}
        </Alert>}
        {result && <Alert status="success" zIndex={1}>
          <AlertIcon />
          {result}
        </Alert>}
        <Container centerContent>
          <Box
            as="div"
            marginBottom="10">
            <Heading
              as="h1"
              role="heading"
              textAlign="center"
              fontSize="48px"
              lineHeight="58px"
              color="#FEF9F9"
              fontStyle="normal"
              fontWeight="400"
              title="request-a-term">
              
              {t("requestATermTitle")}
            </Heading>
            <Text
              title="request-a-term-description"
              paddingTop="2"
              width="332px"
              height="25px"
              fontFamily="Inter"
              fontStyle="normal"
              fontWeight="400"
              fontSize="14px"
              lineHeight="17px"
              color="#FEF9F9"
            >
              {t("requestATermText")}
            </Text>
          </Box>

          <Stack spacing={1}
            paddingLeft={{ base: 10 }}
            paddingRight={{ base: 10 }}>
            <Center>
              <form
                onSubmit={handleSubmit<FieldValues>(_onSubmit)}
                data-testid="request-term-form">
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="start">
                  <FormControl isInvalid={errors.term}>
                    <FormLabel
                      color="#FFFDFD"
                      htmlFor="term"
                      data-testid="term-label"
                    >
                      {t("termLabel")}
                    </FormLabel>
                    <Input
                      id="term"
                      data-testid="term-input"
                      border="1px solid #000000"
                      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                      backgroundColor="#FFFDFD"
                      borderRadius="3px"
                      height="37px"
                      width={{ base: "300px", md: "526px", lg: "600px" }}
                      marginTop={{ base: 1 }}
                      marginBottom={{ base: 8, md: 6, lg: 4 }}
                      {...register("term", {
                        required: "This field is required",
                        minLength: { value: 2, message: "Minimum length should be 2" }
                      })}
                    />
                    <FormErrorMessage data-testid="error-term-tag">
                      {errors.term && errors.term.message}
                    </FormErrorMessage>
                  </FormControl>

                  <FormLabel
                    marginTop="1"
                    color="#FFFDFD"
                    htmlFor="category"
                    data-testid="category-label">
                    {t("termCategoryLabel")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      data-testid="term-category-select"
                      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                      id="category"
                      placeholder="Select a Category"
                      backgroundColor="#FFFDFD"
                      borderRadius="3px"
                      height="37px"
                      width={{ base: "300px", md: "526px", lg: "600px" }}
                      marginTop="1"
                      marginBottom={{ base: 8, md: 6, lg: 4 }}
                      {...register("category", { required: true })}
                    >
                      <option value="General">{t("generalOption")}</option>
                      <option value="Protocol">{t("protocolOption")}</option>
                      <option value="Dao">{t("DAOoption")}</option>
                      <option value="Token">{t("tokenOption")}</option>
                      <option value="Application">{t("applicationOption")}</option>
                      <option value="Finance">{t("financeOption")}</option>
                    </Select>

                  </FormControl>

                  <FormControl isInvalid={errors.reason}>
                    <FormLabel
                      style={{ color: "#FFFDFD" }}
                      htmlFor="reason"
                      data-testid="reason-label">
                      {t("termAdditionReasonLabel")}
                    </FormLabel>
                    <Textarea
                      data-testid="term-reason"
                      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                      id="reason"
                      backgroundColor="#FFFDFD"
                      borderRadius="3px"
                      width={{ base: "300px", md: "526px", lg: "600px" }}
                      height="164px"
                      marginTop="1"
                      marginBottom={{ base: 8, md: 6, lg: 4 }}
                      {...register("reason", {
                        required: "This field is required",
                        minLength: { value: 10, message: "Minimum length should be 10" }
                      })}
                    />
                    <FormErrorMessage data-testid="error-reason-tag">
                      {errors.reason && errors.reason.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Container centerContent marginTop="3">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      size="invisible"
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_DEV as string}
                      onChange={handleRecaptchChange}
                    />
                    <Button
                      isLoading={isSubmitting}
                      type="submit"
                      data-testid="submit-button"
                      background="#373636"
                      color="#FFFEFE"
                      fontSize="16px"
                      fontWeight="100px"
                      fontStyle="normal"
                      lineHeight="29px">
                      {t("submitBtnText")}
                    </Button>
                  </Container>
                </Flex>
              </form>
            </Center>
          </Stack>
        </Container>
      </chakra.main>
    </PageLayout>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}
export default RequestTerm;

