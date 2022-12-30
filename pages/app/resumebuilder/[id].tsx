// ------------------ NEXT - REACT ------------------
import React, { useEffect, useState } from "react";

import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Router from "next/router";

// ------------------ TYPESCRIPT ------------------
import { Resume } from "../../../lib/types";

// ----------------- FLOWBITE -----------------
import { Alert, Card, Tabs, Flowbite, Spinner } from "flowbite-react";

// ------------------ CUSTOM COMPS ------------------
import { Progress } from "../../../components/resumeCreator/cvBuilder/progress/Progress";

import { BuilderLayout } from "../../../components/resumeCreator/cvBuilder/layout/CvBuilderLayout";

// --------------- TABS COMPONENTS ---------------
import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "../../../components/resumeCreator/cvBuilder/Tabs/TabSelector";

// ------------------ FORMIK ------------------
import { useFormik } from "formik";
import * as Yup from "yup";

// ------------------ REDUX ------------------
import { useSelector, useDispatch } from "react-redux";
import {
  addResume,
  selectAllResumes,
  updateResume,
} from "../../../slices/resumeActions/resumeActionSlice";

const App: NextPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const resumes = useSelector(selectAllResumes);

  const selectedResumeArr = resumes.filter(
    (resume: Resume) => resume.id === router.query.id
  );

  const formSchema = Yup.object().shape({
    mainInfo: Yup.object().shape({
      name: Yup.string().required("Please enter your name"),
      phone: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      city: Yup.string(),
      jobTitle: Yup.string(),
    }),
    educationInfo: Yup.object().shape({
      sectionName: Yup.string(),
    }),
  });

  const formik = useFormik<Resume>({
    initialValues: selectedResumeArr[0],
    validationSchema: formSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateResume(values));
    },
  });

  const [progress, setProgress] = useState(20);

  const allTabs = ["Main Info", "Another Info", "Bnother Info"];

  const [currTab, setCurrTab] = useState(0);

  const [selectedTab, setSelectedTab] = useTabs(allTabs);

  const incrementTab = () => {
    if (currTab < allTabs.length - 1) {
      setCurrTab((prev) => prev + 1);
    }
  };

  const decrementTab = () => {
    if (currTab > 0) {
      setCurrTab((prev) => prev - 1);
    }
  };
  useEffect(() => {
    setSelectedTab(allTabs[currTab]);
  }, [currTab]);

  return (
    <>
      {formik.values?.mainInfo?.name === undefined ? (
        <div className="h-full w-full flex items-center justify-center">
          <Spinner color="warning" size="xl" />
        </div>
      ) : (
        <BuilderLayout>
          <div className="pt-10 md:pt-14 lg:pt-28 pb-3">
            <Progress progress={progress} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl my-6 md:my-9 lg:my-12 text-center font-bold font-sans">
              Tell us a little about yourself
            </h1>

            <Card>
              <form className="flex flex-col" onSubmit={formik.handleSubmit}>
                <div className="w-full border-b-[1px] border-gray-200 flex w-full overflow-x-auto mb-4">
                  <TabSelector
                    isActive={selectedTab === "Main Info"}
                    onClick={() => setSelectedTab("Main Info")}
                  >
                    Main Info
                  </TabSelector>

                  <TabSelector
                    isActive={selectedTab === "Another Info"}
                    onClick={() => setSelectedTab("Another Info")}
                  >
                    Another Info
                  </TabSelector>

                  <TabSelector
                    isActive={selectedTab === "Bnother Info"}
                    onClick={() => setSelectedTab("Bnother Info")}
                  >
                    Bnother Info
                  </TabSelector>
                </div>
                <TabPanel hidden={selectedTab != "Main Info"}>
                  <div className="grid gap-6 md:grid-cols-2 justify-items-stretch">
                    <div className="row-start-2 row-end-3 md:row-start-1 md:row-end-2">
                      <label
                        className="text-md font-semibold text-gray-900"
                        htmlFor="name"
                      >
                        Full Name
                      </label>
                      <input
                        className={
                          formik.errors.mainInfo?.name &&
                          formik.touched.mainInfo?.name
                            ? "input-error"
                            : "input-normal"
                        }
                        id="name"
                        name="mainInfo.name"
                        type="text"
                        placeholder="John Doe"
                        onChange={formik.handleChange}
                        value={formik.values.mainInfo.name}
                      />
                      <div>
                        {formik.errors.mainInfo?.name &&
                        formik.touched.mainInfo?.name ? (
                          <p className="text-sm text-red-600">
                            {formik.errors.mainInfo?.name}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="md:row-span-2 flex items-center justify-center">
                      <div className="flex items-center text-center cursor-pointer justify-center bg-primaryClick rounded-full h-32 w-32">
                        <p className="text-xs text-white">
                          Add Photo <br /> (coming soon)
                        </p>
                      </div>
                    </div>
                    <div>
                      <label
                        className="text-md font-semibold text-gray-900"
                        htmlFor="jobTitle"
                      >
                        Job Title
                      </label>
                      <input
                        className="input-normal"
                        id="jobTitle"
                        name="mainInfo.jobTitle"
                        type="text"
                        placeholder="Frontend Developer"
                        onChange={formik.handleChange}
                        value={formik.values.mainInfo.jobTitle}
                      />
                    </div>

                    <div>
                      <label
                        className="text-md font-semibold text-gray-900"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className={
                          formik.errors.mainInfo?.email &&
                          formik.touched.mainInfo?.email
                            ? "input-error"
                            : "input-normal"
                        }
                        id="email"
                        name="mainInfo.email"
                        type="text"
                        placeholder="johndoe@resumee.com"
                        onChange={formik.handleChange}
                        value={formik.values.mainInfo.email}
                      />
                      <div>
                        {formik.errors.mainInfo?.email &&
                        formik.touched.mainInfo?.email ? (
                          <p className="text-sm text-red-600">
                            {formik.errors.mainInfo?.email}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        className="text-md font-semibold text-gray-900"
                        htmlFor="phone"
                      >
                        Phone
                      </label>
                      <input
                        className={
                          formik.errors.mainInfo?.email &&
                          formik.touched.mainInfo?.email
                            ? "input-error"
                            : "input-normal"
                        }
                        id="phone"
                        name="mainInfo.phone"
                        type="text"
                        placeholder="555 555 55 55"
                        onChange={formik.handleChange}
                        value={formik.values.mainInfo.phone}
                      />
                      <div>
                        {formik.errors.mainInfo?.phone &&
                        formik.touched.mainInfo?.phone ? (
                          <p className="text-sm text-red-600">
                            {formik.errors.mainInfo?.phone}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="md:justify-self-end md:col-start-2 md:col-end-3"></div>
                  </div>
                </TabPanel>
                <TabPanel hidden={selectedTab != "Another Info"}>
                  <div>
                    <label
                      className="text-md font-semibold text-gray-900"
                      htmlFor="sectionName"
                    >
                      Education
                    </label>
                    <input
                      className="input-normal"
                      id="sectionName"
                      name="educationInfo.sectionName"
                      type="text"
                      placeholder="School Name"
                      onChange={formik.handleChange}
                      value={formik.values.educationInfo?.sectionName}
                    />
                  </div>
                </TabPanel>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="secondary-btn hidden md:inline-block w-full p-5 md:w-auto"
                    onClick={() => {
                      selectedTab === "Main Info"
                        ? Router.push("/app/dashboard")
                        : decrementTab();
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="primary-btn w-full p-5 md:w-auto "
                    onClick={() => {
                      incrementTab();
                      formik.dirty && formik.isValid
                        ? () => Router.push("/app/dashboard")
                        : () => console.log("not ready");
                    }}
                  >
                    Next
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </BuilderLayout>
      )}
    </>
  );
};

export default App;
