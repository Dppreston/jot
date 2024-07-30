import { useParams } from "react-router";
import Navbar from "../main-components/Navbar";
import Button from "../buttons/ButtonMain";
import Input from "../buttons/Input";
import logo from "../assets/jot-logo.png";
import darkLogo from "../assets/jot-logo-DM.png";
import { useContext, useState } from "react";
import InformationPopup from "../popup-components/InformationPopup";
import InfoData from "../staticdata/InfoData";
import { GlobalContext, UserContext } from "../App";
import { faqData } from "../staticdata/FaqData";
import { TosData } from "../staticdata/TosData";
let contactData: {
  id: number;
  type: string;
  title: string;
  subTitle?: string;
  inputSatsified?: boolean;
}[] = [
  {
    id: 1,
    type: "text",
    title: "Name",
    subTitle: "* required",
    inputSatsified: false,
  },
  {
    id: 2,
    type: "email",
    title: "Email",
    subTitle: "* required",
    inputSatsified: false,
  },
  {
    id: 3,
    type: "text",
    title: "Username",
    subTitle: "If you have an account",
    inputSatsified: false,
  },
];

let contactDataFinal = {
  name: "",
  email: "",
  username: "",
  message: "",
};

type FaqData = {
  id: number;
  question: string;
  body: string;
  opened: boolean;
};

//contact us

export const ContactUs = () => {
  const [satisfied, setSatisfied] = useState<boolean>(false);
  const [, setInputSatisfied] = useState<boolean>(false);
  const [, setEmailSatisfied] = useState<boolean>(false);
  const [, setUsernameSatisfied] = useState<boolean>(false);
  const [buttonPopup, setButtonPopup] = useState<boolean>(false);
  const { darkActive } = useContext<GlobalContext>(UserContext);

  //receive contact data

  const retrieveContactData = (identifier: string, input: string) => {
    identifier == "Name"
      ? (contactDataFinal.name = input)
      : contactDataFinal.name,
      identifier == "Email"
        ? (contactDataFinal.email = input)
        : contactDataFinal.email,
      identifier == "Username"
        ? (contactDataFinal.username = input)
        : contactDataFinal.username;
    identifier == "Message"
      ? (contactDataFinal.message = input)
      : contactDataFinal.message;
    contactRequirements();
  };

  //check requirements

  const contactRequirements = () => {
    // checkmark check

    if (contactDataFinal.name.length > 0) {
      setInputSatisfied(!false);
      contactData[0].inputSatsified = !false;
    } else {
      setInputSatisfied(false);
      contactData[0].inputSatsified = false;
    }

    if (contactDataFinal.email.includes("@")) {
      setEmailSatisfied(!false);
      contactData[1].inputSatsified = !false;
    } else {
      setEmailSatisfied(false);
      contactData[1].inputSatsified = false;
    }

    if (contactDataFinal.username.length > 0) {
      setUsernameSatisfied(!false);
      contactData[2].inputSatsified = !false;
    } else {
      setUsernameSatisfied(false);
      contactData[2].inputSatsified = false;
    }

    if (
      contactDataFinal.name.length > 0 &&
      contactDataFinal.message.length > 0 &&
      contactDataFinal.email.includes("@")
    ) {
      setSatisfied(!false);
    } else {
      setSatisfied(false);
    }
  };

  return (
    <>
      <div className="contact__us--wrapper">
        <div
          className="contact__upper"
          style={
            darkActive == !false
              ? { background: "var(--hover-on-black-DM)" }
              : undefined
          }
        >
          <h3>At Jot, we are dedicated to serving our users.</h3>
          <h5>
            Send us a message and we will do our best to get back to you as soon
            as possible!
          </h5>
        </div>
        <div
          className="contact__container"
          style={
            darkActive == !false
              ? { background: "var(--hover-on-black-DM)" }
              : undefined
          }
        >
          <h2>Reach Out</h2>
          <form action="submit" className="contact__info--wrapper">
            <div className="contact__info--left">
              {contactData
                ? contactData.map((data) => (
                    <label className="contact__data--label" key={data.id}>
                      <span
                        className="contact__data--label--title--wrapper"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4>{data.title}</h4>
                        {data.subTitle ? (
                          <h5 style={{ marginRight: "0" }}>{data.subTitle}</h5>
                        ) : null}
                      </span>
                      <Input
                        width="250px"
                        inputType={data.type}
                        inactive={!false}
                        retrieveData={retrieveContactData}
                        identifier={data.title}
                        inputSatisfied={data.inputSatsified}
                        color={
                          darkActive == !false ? "var(--hover-DM)" : undefined
                        }
                      />
                    </label>
                  ))
                : null}
            </div>
            <div className="contact__info--right">
              <div className="contact__data--label contact__body--label">
                <span
                  className="contact__data--label--title--wrapper"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h4>Message</h4>
                  <h5>* required</h5>
                </span>
                <textarea
                  name="contact__body"
                  id="contact__body"
                  onChange={(e) =>
                    retrieveContactData("Message", e.currentTarget.value)
                  }
                  style={
                    darkActive == !false
                      ? {
                          background: "var(--hover-DM)",
                          color: "var(--white-DM)",
                        }
                      : undefined
                  }
                ></textarea>
              </div>
            </div>
          </form>
          <div
            className="contact__button--container"
            onMouseEnter={() => {
              satisfied == false
                ? setButtonPopup(!false)
                : setButtonPopup(false);
            }}
            onMouseLeave={() => setButtonPopup(false)}
          >
            <Button
              content="Send"
              inactive={satisfied == !false ? !false : false}
              icon={false}
            />
            {buttonPopup == !false
              ? InfoData.filter((el) => el.type == "contactUsButton").map(
                  (data) => <InformationPopup data={data} key={data.id} />
                )
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

//faq

export const Faq = () => {
  const [, setSelected] = useState<boolean>(false);
  const { darkActive } = useContext<GlobalContext>(UserContext);

  //handle selected

  const handleSelected = (data: FaqData) => {
    const selectedFaq = faqData.find((el) => el.id == data.id);
    if (selectedFaq?.opened == false) {
      selectedFaq.opened = true;
      setSelected(!false);
      setTimeout(() => {
        setSelected(false);
      }, 100);
    } else {
      selectedFaq!.opened = false;
      setSelected(!false);
      setTimeout(() => {
        setSelected(false);
      }, 100);
    }
  };

  return (
    <>
      <div className="faq__wrapper">
        {faqData.map((data) => (
          <button
            className="faq__tile--wrapper"
            key={data.id}
            onClick={() => handleSelected(data)}
          >
            <div
              className="faq__tile--closed"
              style={
                data.opened == !false
                  ? {
                      background: "var(--hover-DM)",
                      border: "none",
                      borderRadius: "var(--outer--br)",
                    }
                  : darkActive == !false
                  ? { background: "var(--hover-on-black-DM)" }
                  : undefined
              }
            >
              <h3>{data.question}</h3>
              <i
                className={
                  data.opened == false
                    ? "fa-solid fa-chevron-right"
                    : "fa-solid fa-chevron-down"
                }
                style={
                  darkActive == !false ? { color: "var(--accent)" } : undefined
                }
              ></i>
            </div>
            {data.opened == !false ? (
              <div className="faq__tile--open">
                {" "}
                <h4
                  style={
                    darkActive == !false
                      ? { color: "var(--white-DM)" }
                      : undefined
                  }
                >
                  {" "}
                  {data.body}
                </h4>
                {<br />}
                {data.link ? (
                  <h4
                    style={
                      darkActive == !false
                        ? { color: "var(--white-DM)" }
                        : undefined
                    }
                  >
                    {data.linkText}
                    <span
                      onClick={() => window.open(data.link!)}
                      style={
                        darkActive == !false
                          ? { borderBottom: "1px solid var(--accent)" }
                          : undefined
                      }
                    >
                      {" "}
                      here
                    </span>
                  </h4>
                ) : null}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </>
  );
};

//tos

export const Tos = () => {
  const { darkActive } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <div className="tos__wrapper">
        <div className="tos__top--container">
          <h3>
            Welcome to Jot! These Terms of Service ("Terms") govern your use of
            the Jot platform and any services offered through it. By using Jot,
            you agree to these Terms. Please read them carefully.
          </h3>
        </div>
        {TosData.map((data) => (
          <div className="tos__tile" key={data.id}>
            <h3>{data.title}</h3>
            <div className="tos__tile--bottom">
              <h4>{data.body}</h4>
              {data.list ? (
                <ul>
                  {data.listBody?.map((el) => (
                    <li key={el}>
                      <h4>{el}</h4>
                    </li>
                  ))}
                </ul>
              ) : null}

              {data.link ? (
                <h4
                  className="tos__link"
                  onClick={() => {
                    window.open(data.link);
                  }}
                  style={
                    darkActive == !false
                      ? { borderBottom: "1px solid var(--accent); !important" }
                      : undefined
                  }
                >
                  Send us a message
                </h4>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const Info = () => {
  const { infoRequest } = useParams();
  const { darkActive, loggedin } = useContext<GlobalContext>(UserContext);

  return (
    <>
      <Navbar />
      <div className="margin__wrapper">
        <div className="site__wrapper info__page--wrapper">
          <div className="site__column--wrapper">
            <div
              className="info__upper--container"
              style={
                darkActive == !false
                  ? { borderBottom: "1px solid var(--hover-on-black-DM)" }
                  : undefined
              }
            >
              <div className="info__title--container">
                <h2>
                  {infoRequest == "contact-us"
                    ? "Questions or Concerns?"
                    : infoRequest == "FAQ"
                    ? "FAQ"
                    : infoRequest == "terms-of-service"
                    ? "Jot Terms of Service"
                    : undefined}
                </h2>
                <img
                  src={
                    darkActive == false || loggedin == false ? logo : darkLogo
                  }
                  alt="jot-logo"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
            </div>
          </div>
          {infoRequest == "contact-us" ? <ContactUs /> : null}
          {infoRequest == "FAQ" ? <Faq /> : null}
          {infoRequest == "terms-of-service" ? <Tos /> : null}
        </div>
      </div>
    </>
  );
};
export default Info;
