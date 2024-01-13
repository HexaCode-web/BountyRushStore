import React, { useEffect } from "react";
import "./Footer.css";

import CreateToast from "@/lib/createToast";
import GETDOC from "@/lib/getDoc";
const Footer = (props) => {
  const [footerData, setFooterData] = React.useState({ logo: "" });

  useEffect(() => {
    const FetchData = async () => {
      const [footerData, Title, Logo] = await Promise.all([
        GETDOC("websiteData", "Footer").then((res) => ({ ...res.Footer })),
        GETDOC("websiteData", "title").then((res) => ({ title: res.title })),
        GETDOC("websiteData", "icon").then((res) => ({ logo: res.icon })),
      ]);

      setFooterData((prev) => ({ ...prev, ...footerData }));
      setFooterData((prev) => ({ ...prev, ...Title }));
      setFooterData((prev) => ({ ...prev, ...Logo }));
    };
    FetchData();
  }, []);
  const element = props.catagories.map((category) => {
    return (
      <li key={category.Name}>
        <a href={`/category/${category.Name}`}>{category.Name}</a>
      </li>
    );
  });
  const SocialContainer = [];

  for (const Social in footerData.Socials) {
    SocialContainer.push({ name: Social, Link: footerData.Socials[Social] });
  }
  const RenderSocials = SocialContainer?.map((Social) => {
    let img = "";
    switch (Social.name) {
      case "Facebook":
        img = "/facebook.png";
        break;
      case "Youtube":
        img = "/youtube.png";
        break;
      case "Twitter":
        img = "/twitter.png";
        break;
      case "Telegram":
        img = "/telegram.png";
        break;
      case "Pinterest":
        img = "/pinterest.png";
        break;
      case "Instagram":
        img = "/instagram.png";
        break;
      default:
        break;
    }
    return Social.Link ? (
      <li data-aos="fade-up">
        <a href={Social.Link}>
          <img src={img} />
        </a>
      </li>
    ) : (
      ""
    );
  });
  return (
    <div className="FooterWrapper">
      <div className="columns">
        <div className="col">
          <p>Catagories</p>
          <ul>{element}</ul>
        </div>
        <div className="col">
          <p>Support</p>
          <ul>
            <li>
              <a
                href="#"
                onClick={() => {
                  props.activeUser
                    ? props.activeUser.admin
                      ? CreateToast("admins don't have pending orders", "error")
                      : (window.location.href = "/User")
                    : CreateToast("please login first", "error");
                }}
              >
                Order status
              </a>
            </li>
          </ul>
        </div>
        <div className="col">
          <p>company</p>
          <ul>
            <li>
              <a href="#">Customer service</a>
            </li>
            <li>
              <a href="#">Terms of use</a>
            </li>
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
          </ul>
        </div>
        <div className="col">
          <p>Contact</p>
          {footerData.Email && (
            <div className="field">
              <span>Email</span>
              <p>{footerData.Email}</p>
            </div>
          )}
          {footerData.Phone && (
            <div className="field">
              <span>Telephone</span>
              <p>{footerData.Phone}</p>
            </div>
          )}
          {footerData.Address && (
            <div className="field">
              <span>Address</span>
              <p>{footerData.Address}</p>
            </div>
          )}
        </div>
      </div>
      <div className="Links">
        <p>Follow us</p>
        <ul>{RenderSocials}</ul>
      </div>
      <div className="CopyRight">
        <img src={footerData.Logo}></img>
        <p>&copy; {footerData.title} 2023</p>
      </div>
    </div>
  );
};

export default Footer;
