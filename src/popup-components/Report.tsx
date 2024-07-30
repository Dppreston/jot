import { useContext, useEffect, useState } from "react";
import Button from "../buttons/ButtonMain";
import { GlobalContext, UserContext } from "../App";
import smallLoader from "../assets/small--loader.gif";
import smallLoaderDark from "../assets/small--loader--dark.gif";
import axios from "axios";
import Loader from "../loaders/Loader";

const reportOptions: { _id: number; content: string }[] = [
  {
    _id: 1,
    content: "inappropriate content or user",
  },
  {
    _id: 2,
    content: "Plagiarism or stolen content",
  },
  {
    _id: 3,
    content: "Copyright Infringement",
  },
  {
    _id: 4,
    content: "Spam/Self-Promotion",
  },
  {
    _id: 5,
    content: "Content or user has broken or violated company policies",
  },
];

type ReportProps = {
  data: {
    reportType: string;
    reportReferenceId: string | number;
  };
};

type ReportData = {
  referenceId: string;
  referenceUserId: string;
  title: string;
  username: string;
  type: string;
};

let selectedReportReasons = new Array();

const Report = ({ data }: ReportProps) => {
  const { setReportActive, darkActive } =
    useContext<GlobalContext>(UserContext);
  const [reportDataFinal, setReportDataFinal] = useState<ReportData>();
  const [submitActive, setSubmitActive] = useState<boolean>(false);
  const [loaderActive, setLoaderActive] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  //fetch report postData

  const handleFetchReportPostData = async () => {
    const res = await axios.get(
      `/jot-posts?reportPostData=true&postId=${data.reportReferenceId}`
    );
    if (res.data.length != 0) {
      //fetch username of post
      const usernameRes = await axios.get(
        `/jot-users?reportUsername=true&userId=${res.data[0].userId}`
      );
      if (usernameRes.data.length != 0) {
        setReportDataFinal({
          referenceId: res.data[0]._id,
          referenceUserId: res.data[0].userId,
          title: res.data[0].title,
          username: usernameRes.data[0].username,
          type: data.reportType,
        });
      }
    }
  };

  //fetch report Comment Data

  const handleFetchReportCommentData = async () => {
    const res = await axios.get(
      `/jot-comments?reportData=true&commentId=${data.reportReferenceId}`
    );

    if (res.data.length != 0) {
      //fetch username of post
      const usernameRes = await axios.get(
        `/jot-users?reportUsername=true&userId=${res.data[0].userId}`
      );
      if (usernameRes.data.length != 0) {
        setReportDataFinal({
          referenceId: res.data[0]._id,
          referenceUserId: res.data[0].userId,
          title: res.data[0].commentBody,
          username: usernameRes.data[0].username,
          type: data.reportType,
        });
      }
    }
  };

  //handle selected reasons

  const handleReportReasons = (data: { _id: number; content: string }) => {
    const reportReasonCheck = selectedReportReasons.find(
      (el) => el == data.content
    );

    if (reportReasonCheck == undefined) {
      selectedReportReasons.push(data.content);
      setSubmitActive(!false);
    } else {
      let index = selectedReportReasons.indexOf(reportReasonCheck);
      selectedReportReasons.splice(index, 1);
    }

    if (selectedReportReasons.length == 0) {
      setSubmitActive(false);
    }
  };

  //sumbit report

  const handleReportSubmit = async () => {
    setLoaderActive(!false);
    const res = await axios.post(
      `/jot-reports?newReport=true&reportReasons=${JSON.stringify(
        selectedReportReasons
      )}`,
      reportDataFinal
    );
    if (res.data == !false) {
      setTimeout(() => {
        setLoadingState(!false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (data.reportType == "post") {
      handleFetchReportPostData();
    }

    if (data.reportType == "comment") {
      handleFetchReportCommentData();
    }
  }, [data]);

  useEffect(() => {
    selectedReportReasons = [];
  }, []);

  return (
    <>
      <div className="full__blur--wrapper">
        <div
          className="report__popup"
          style={
            darkActive == !false
              ? { background: "var(--hover-on-black-DM)" }
              : undefined
          }
        >
          <div className="report__top">
            <h3>Submit a Report</h3>
            <Button
              content={"fa-solid fa-xmark"}
              icon={!false}
              inactive={!false}
              action={setReportActive}
              optionalValue={false}
            />
          </div>
          {reportDataFinal != undefined ? (
            <div className="report__middle">
              <div
                className="report__reference"
                style={
                  darkActive == !false
                    ? { background: "var(--hover-DM)" }
                    : undefined
                }
              >
                <span>
                  <h4>{reportDataFinal.type}</h4>
                  <h4>By: {reportDataFinal.username}</h4>
                </span>
                <h4>{reportDataFinal.title} ...</h4>
              </div>
              <div className="report__reason">
                <h3>Reason</h3>
                {reportOptions.map((data) => (
                  <div className="report__reason--option" key={data._id}>
                    {" "}
                    <input
                      style={
                        darkActive == !false
                          ? { background: "none" }
                          : undefined
                      }
                      type="checkbox"
                      onClick={() => {
                        handleReportReasons(data);
                      }}
                      id="report__selection"
                    />
                    <h5>{data.content}</h5>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <img
              src={darkActive == !false ? smallLoaderDark : smallLoader}
              alt="small-loader"
              className="small__report--loader"
            />
          )}

          <div className="report__bottom">
            <Button
              content="Submit"
              inactive={submitActive == !false ? !false : false}
              icon={false}
              action={handleReportSubmit}
            />
          </div>
          {loaderActive == !false ? (
            <Loader loadingState={loadingState} />
          ) : null}
        </div>
      </div>
    </>
  );
};
export default Report;
